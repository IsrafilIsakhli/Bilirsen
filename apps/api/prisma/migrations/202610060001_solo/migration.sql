CREATE TABLE app.users (
  id uuid PRIMARY KEY, "displayName" text NOT NULL,
  "createdAt" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE app.sessions (
  id uuid PRIMARY KEY, "userId" uuid NOT NULL REFERENCES app.users(id),
  "accessHash" text NOT NULL UNIQUE, "refreshHash" text NOT NULL UNIQUE,
  "previousRefreshHashes" text[] NOT NULL,
  "accessExpiresAt" timestamptz(3) NOT NULL, "refreshExpiresAt" timestamptz(3) NOT NULL,
  revoked boolean NOT NULL DEFAULT false
);
CREATE TABLE app.player_ranks (
  "userId" uuid NOT NULL REFERENCES app.users(id), mode text NOT NULL CHECK (mode IN ('solo','duel')),
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0), PRIMARY KEY ("userId",mode)
);
CREATE TABLE app.question_versions (
  id uuid PRIMARY KEY, "bankId" text NOT NULL UNIQUE, "factKey" text NOT NULL UNIQUE,
  difficulty text NOT NULL CHECK (difficulty IN ('asan','orta','çətin')), category text NOT NULL,
  text text NOT NULL, options jsonb NOT NULL, "correctOption" text NOT NULL CHECK ("correctOption" IN ('A','B','C','D')),
  "contentHash" text NOT NULL, "releaseStatus" text NOT NULL DEFAULT 'test_only' CHECK ("releaseStatus" IN ('test_only','approved')),
  CHECK (jsonb_typeof(options)='object' AND options ?& ARRAY['A','B','C','D'] AND options - ARRAY['A','B','C','D']='{}'::jsonb)
);
CREATE INDEX question_versions_release_difficulty ON app.question_versions("releaseStatus",difficulty);
CREATE TABLE app.matches (
  id uuid PRIMARY KEY, "userId" uuid NOT NULL REFERENCES app.users(id),
  "activeUserId" uuid UNIQUE REFERENCES app.users(id),
  status text NOT NULL CHECK (status IN ('question_open','question_closed','finished','cancelled_server')),
  state jsonb NOT NULL, revision integer NOT NULL DEFAULT 0 CHECK (revision>=0),
  "dueAt" timestamptz(3), "createdAt" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ("activeUserId" IS NULL OR "activeUserId"="userId"),
  CHECK ((status IN ('question_open','question_closed') AND "activeUserId" IS NOT NULL AND "dueAt" IS NOT NULL) OR (status IN ('finished','cancelled_server') AND "activeUserId" IS NULL AND "dueAt" IS NULL))
);
CREATE INDEX matches_due ON app.matches(status,"dueAt");
CREATE INDEX matches_history ON app.matches("userId","createdAt" DESC);
CREATE TABLE app.match_results (
  "matchId" uuid PRIMARY KEY REFERENCES app.matches(id), "userId" uuid NOT NULL REFERENCES app.users(id),
  payload jsonb NOT NULL, "finishedAt" timestamptz(3) NOT NULL
);
CREATE INDEX match_results_history ON app.match_results("userId","finishedAt" DESC);
CREATE TABLE app.rank_ledger (
  "matchId" uuid NOT NULL REFERENCES app.matches(id), "userId" uuid NOT NULL REFERENCES app.users(id),
  mode text NOT NULL CHECK (mode IN ('solo','duel')), "previousPoints" integer NOT NULL CHECK ("previousPoints">=0),
  "theoreticalDelta" integer NOT NULL, "actualDelta" integer NOT NULL, points integer NOT NULL CHECK (points>=0),
  PRIMARY KEY ("matchId","userId",mode), CHECK (points="previousPoints"+"actualDelta")
);
CREATE TABLE app.command_receipts (
  "userId" uuid NOT NULL REFERENCES app.users(id), "commandId" uuid NOT NULL, fingerprint text NOT NULL,
  response jsonb NOT NULL, "createdAt" timestamptz(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("userId","commandId")
);
