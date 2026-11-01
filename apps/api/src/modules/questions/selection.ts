import { randomInt, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { optionSchema, difficultySchema } from '@azquiz/contracts';
import { GameRuleError, questionCounts } from '../games/domain/solo';
import type { PrivateQuestion } from '../games/domain/solo';
const candidateSchema = z.object({
  bankId: z.string(),
  factKey: z.string(),
  difficulty: difficultySchema,
  category: z.string(),
});
const recordSchema = candidateSchema.extend({
  text: z.string(),
  options: z.object({ A: z.string(), B: z.string(), C: z.string(), D: z.string() }),
  correctOption: optionSchema,
});
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    const left = copy[i];
    const right = copy[j];
    if (left === undefined || right === undefined) throw new Error('Invalid shuffle input');
    copy[i] = right;
    copy[j] = left;
  }
  return copy;
}
function selectCandidates<T extends z.infer<typeof candidateSchema>>(
  pool: T[],
  recentBankIds: ReadonlySet<string>,
): T[] {
  const selected: T[] = [];
  const categoryCounts = new Map<string, number>();
  const selectedFacts = new Set<string>();
  for (const [difficulty, count] of Object.entries(questionCounts())) {
    const candidates = shuffle(pool.filter((q) => q.difficulty === difficulty));
    if (candidates.length < count)
      throw new GameRuleError('insufficient_questions', 'Sınaq sual dəsti hazır deyil.');
    for (let index = 0; index < count; index += 1) {
      candidates.sort(
        (a, b) =>
          Number(recentBankIds.has(a.bankId)) - Number(recentBankIds.has(b.bankId)) ||
          (categoryCounts.get(a.category) ?? 0) - (categoryCounts.get(b.category) ?? 0),
      );
      const row = candidates.shift();
      if (!row) throw new Error('Question pool changed during selection');
      if (selectedFacts.has(row.factKey))
        throw new GameRuleError('insufficient_questions', 'Sual dəstində təkrarlanan fakt var.');
      selectedFacts.add(row.factKey);
      categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
      selected.push(row);
    }
  }
  return selected;
}

export function selectQuestionBankIds(
  records: unknown[],
  recentBankIds: ReadonlySet<string>,
): string[] {
  return selectCandidates(
    records.map((record) => candidateSchema.parse(record)),
    recentBankIds,
  ).map((question) => question.bankId);
}

export function selectQuestions(
  records: unknown[],
  recentBankIds: ReadonlySet<string>,
): PrivateQuestion[] {
  const selected = selectCandidates(
    records.map((record) => recordSchema.parse(record)),
    recentBankIds,
  );
  return shuffle(
    selected.map((row) => {
      const keys = shuffle(['A', 'B', 'C', 'D'] as const);
      const newKeys = ['A', 'B', 'C', 'D'] as const;
      const options = keys.map((original, index) => {
        const key = newKeys[index];
        if (!key) throw new Error('Invalid option permutation');
        return { key, text: row.options[original] };
      });
      const correctOption = newKeys[keys.indexOf(row.correctOption)];
      if (!correctOption) throw new Error('Correct answer mapping is incomplete');
      return { ...row, id: randomUUID(), options, correctOption };
    }),
  );
}
