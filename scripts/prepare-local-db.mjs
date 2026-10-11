import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, 'apps/api/.env.local');
let password;
try {
  const existing = await readFile(envPath, 'utf8');
  const connection = existing.match(/^DATABASE_URL=(.+)$/m)?.[1];
  if (!connection) throw new Error('Existing runtime configuration has no DATABASE_URL.');
  password = new URL(connection).password;
  if (!/^[a-f0-9]{64}$/.test(password)) throw new Error('Unexpected runtime credential format.');
} catch (error) {
  if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  password = randomBytes(32).toString('hex');
  await writeFile(
    envPath,
    `NODE_ENV=development\nPORT=3000\nDATABASE_URL=postgresql://bilirsen_runtime:${password}@127.0.0.1:5432/quiz_az?schema=app\n`,
    { flag: 'wx' },
  );
}
const runSql = (sql) => {
  const result = spawnSync(
    'docker',
    [
      'compose',
      'exec',
      '-T',
      'postgres',
      'psql',
      '-X',
      '-v',
      'ON_ERROR_STOP=1',
      '-U',
      'quiz_admin',
      '-d',
      'quiz_az',
      '-q',
    ],
    { cwd: root, input: sql, encoding: 'utf8' },
  );
  // SQL errors can repeat credentials; never print stdin/stderr.
  if (result.status !== 0)
    throw new Error(
      'Database preparation failed; existing bank remains preserved. Check Docker/PostgreSQL.',
    );
};
const migration = await readFile(
  path.join(root, 'apps/api/prisma/migrations/202610060001_solo/migration.sql'),
  'utf8',
);
const checksum = createHash('sha256').update(migration).digest('hex');
runSql(`BEGIN;
SELECT pg_advisory_xact_lock(246801358);
CREATE SCHEMA IF NOT EXISTS app;
REVOKE ALL ON SCHEMA app FROM PUBLIC;
CREATE TABLE IF NOT EXISTS app.schema_migrations (version text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now());
DO $migrate$ BEGIN
IF EXISTS(SELECT 1 FROM app.schema_migrations WHERE version='202610060001' AND checksum <> '${checksum}') THEN RAISE EXCEPTION 'Migration checksum mismatch'; END IF;
IF NOT EXISTS(SELECT 1 FROM app.schema_migrations WHERE version='202610060001') THEN
${migration.replace(/CREATE SCHEMA[^;]+;/g, '')}
INSERT INTO app.schema_migrations(version,checksum) VALUES ('202610060001','${checksum}');
END IF;
END $migrate$;
DO $role$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='bilirsen_runtime') THEN CREATE ROLE bilirsen_runtime LOGIN; END IF; END $role$;
ALTER ROLE bilirsen_runtime PASSWORD '${password}';
GRANT CONNECT ON DATABASE quiz_az TO bilirsen_runtime;
GRANT USAGE ON SCHEMA app TO bilirsen_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO bilirsen_runtime;
REVOKE ALL ON app.schema_migrations FROM bilirsen_runtime;
REVOKE INSERT, UPDATE, DELETE ON app.question_versions FROM bilirsen_runtime;
COMMIT;`);

// Explicit development pool only. This does not approve or mutate the source bank.
const seedSchema = z.object({
  id: z.string().regex(/^AZQ-\d{5}$/),
  category: z.string().min(1),
  difficulty: z.enum(['asan', 'orta', 'çətin']),
  status: z.literal('review_ready'),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
});
const rows = (await readFile(path.join(root, 'question-bank/data/questions.jsonl'), 'utf8'))
  .trim()
  .split(/\r?\n/)
  .map((line) => seedSchema.parse(JSON.parse(line)));
const selected = [];
for (const [difficulty, limit] of [
  ['asan', 24],
  ['orta', 60],
  ['çətin', 36],
]) {
  const categories = new Map();
  for (const row of rows.filter(
    (q) => q.difficulty === difficulty && q.status === 'review_ready',
  )) {
    const group = categories.get(row.category) ?? [];
    group.push(row);
    categories.set(row.category, group);
  }
  while (selected.filter((q) => q.difficulty === difficulty).length < limit) {
    let found = false;
    for (const group of categories.values()) {
      const row = group.shift();
      if (row && selected.filter((q) => q.difficulty === difficulty).length < limit) {
        selected.push(row);
        found = true;
      }
    }
    if (!found) throw new Error('Insufficient development questions.');
  }
}
const inserts = selected.map((row) => {
  if (!/^AZQ-\d{5}$/.test(row.id)) throw new Error('Invalid bank identifier');
  return `INSERT INTO app.question_versions (id,"bankId","factKey",difficulty,category,text,options,"correctOption","contentHash","releaseStatus") SELECT '${randomUUID()}',id,fact_key,difficulty,category,question,options,correct_option,content_hash,'test_only' FROM question_bank.questions WHERE id='${row.id}' AND content_hash='${row.contentHash}' AND status='review_ready' ON CONFLICT ("bankId") DO NOTHING;`;
});
const selectedIds = selected.map((row) => `'${row.id}'`).join(',');
runSql(
  `BEGIN;\n${inserts.join('\n')}\nDO $pool$ BEGIN IF (SELECT COUNT(*) FROM app.question_versions WHERE "bankId" IN (${selectedIds}) AND "releaseStatus"='test_only') <> ${selected.length} THEN RAISE EXCEPTION 'Development pool does not match the source bank'; END IF; END $pool$;\nCOMMIT;`,
);
await mkdir(path.join(root, 'docs/database'), { recursive: true });
await writeFile(
  path.join(root, 'docs/database/test-pool.json'),
  JSON.stringify(
    { releaseStatus: 'test_only', publicApproval: false, questionIds: selected.map((q) => q.id) },
    null,
    2,
  ) + '\n',
);
console.log(
  'Local app schema prepared; 120 questions selected for development only. Source bank unchanged.',
);
