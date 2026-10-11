import { z } from 'zod';
import { difficultySchema, optionSchema, resultSchema } from '@azquiz/contracts';
import type { Difficulty, GameResult, GameSnapshot, OptionKey } from '@azquiz/contracts';
import { describeRank } from '../../rankings/rank';

export const RULES = {
  version: 'solo-1',
  asan: { count: 2, seconds: 20, score: 20, correctRank: 5, wrongRank: -3 },
  orta: { count: 5, seconds: 25, score: 25, correctRank: 8, wrongRank: -4 },
  çətin: { count: 3, seconds: 30, score: 30, correctRank: 12, wrongRank: -5 },
} as const;
export const privateQuestionSchema = z.object({
  id: z.uuid(),
  bankId: z.string(),
  factKey: z.string(),
  category: z.string(),
  difficulty: difficultySchema,
  text: z.string(),
  options: z.array(z.object({ key: optionSchema, text: z.string() })).length(4),
  correctOption: optionSchema,
});
const closedAnswerSchema = z.object({
  questionId: z.uuid(),
  selected: optionSchema.nullable(),
  correct: z.boolean(),
  points: z.number(),
  rankDelta: z.number(),
});
export const soloStateSchema = z.object({
  rulesVersion: z.literal('solo-1'),
  questions: z.array(privateQuestionSchema).length(10),
  index: z.number().int().min(0).max(9),
  openedAt: z.number(),
  deadlineAt: z.number(),
  nextAt: z.number().nullable(),
  answers: z.array(closedAnswerSchema),
  result: resultSchema.nullable(),
});
export type PrivateQuestion = z.infer<typeof privateQuestionSchema>;
export type SoloState = z.infer<typeof soloStateSchema>;
export type MatchStatus = GameSnapshot['status'];

export class GameRuleError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
export function createSolo(questions: PrivateQuestion[], now: number): SoloState {
  const first = questions[0];
  if (!first || questions.length !== 10 || new Set(questions.map((q) => q.factKey)).size !== 10) {
    throw new GameRuleError(
      'insufficient_questions',
      'Sınaq üçün kifayət qədər fərqli sual yoxdur.',
    );
  }
  for (const difficulty of ['asan', 'orta', 'çətin'] as const) {
    if (questions.filter((q) => q.difficulty === difficulty).length !== RULES[difficulty].count) {
      throw new GameRuleError('invalid_distribution', 'Sual bölgüsü düzgün deyil.');
    }
  }
  return {
    rulesVersion: RULES.version,
    questions,
    index: 0,
    openedAt: now,
    deadlineAt: now + RULES[first.difficulty].seconds * 1000,
    nextAt: null,
    answers: [],
    result: null,
  };
}
export function currentQuestion(state: SoloState): PrivateQuestion {
  const question = state.questions[state.index];
  if (!question) throw new Error('Persisted game has no current question');
  return question;
}
export function closeQuestion(state: SoloState, selected: OptionKey | null, now: number): void {
  const question = currentQuestion(state);
  if (state.nextAt !== null)
    throw new GameRuleError('question_closed', 'Bu suala cavab artıq bağlanıb.');
  const correct = selected === question.correctOption;
  const rule = RULES[question.difficulty];
  state.answers.push({
    questionId: question.id,
    selected,
    correct,
    points: correct ? rule.score : 0,
    rankDelta: selected === null ? 0 : correct ? rule.correctRank : rule.wrongRank,
  });
  state.nextAt = now + 1600;
}
export function submitAnswer(
  state: SoloState,
  questionId: string,
  option: OptionKey,
  receivedAt: number,
): void {
  if (state.result) throw new GameRuleError('game_finished', 'Yarış artıq bitib.');
  if (currentQuestion(state).id !== questionId)
    throw new GameRuleError('stale_question', 'Bu sual artıq keçib.');
  if (receivedAt >= state.deadlineAt)
    throw new GameRuleError('answer_late', 'Bu sualın vaxtı bitib.');
  closeQuestion(state, option, receivedAt);
}
export function advanceSolo(state: SoloState, now: number): 'unchanged' | 'changed' | 'settle' {
  if (state.result) return 'unchanged';
  if (state.nextAt === null) {
    if (now < state.deadlineAt) return 'unchanged';
    closeQuestion(state, null, state.deadlineAt);
    if (now < (state.nextAt ?? Infinity)) return 'changed';
  }
  if (now < (state.nextAt ?? Infinity)) return 'unchanged';
  if (state.index === 9) return 'settle';
  state.index += 1;
  state.openedAt = now;
  state.deadlineAt = now + RULES[currentQuestion(state).difficulty].seconds * 1000;
  state.nextAt = null;
  return 'changed';
}
export function finishSolo(
  state: SoloState,
  rankPoints: number,
  reason: GameResult['reason'],
  now: number,
): GameResult {
  const delta = state.answers.reduce((sum, answer) => sum + answer.rankDelta, 0);
  const points = Math.max(0, rankPoints + delta);
  const result: GameResult = {
    score: state.answers.reduce((sum, answer) => sum + answer.points, 0),
    maximumScore: 255,
    correct: state.answers.filter((answer) => answer.correct).length,
    closedQuestions: state.answers.length,
    totalQuestions: 10,
    reason,
    theoreticalDelta: delta,
    actualDelta: points - rankPoints,
    previousRank: describeRank(rankPoints),
    rank: describeRank(points),
    finishedAt: new Date(now).toISOString(),
  };
  state.result = result;
  return result;
}
export function snapshot(
  id: string,
  revision: number,
  status: MatchStatus,
  state: SoloState,
  now: number,
): GameSnapshot {
  const active = status === 'question_open' || status === 'question_closed';
  const question = currentQuestion(state);
  const answer = state.answers.find((entry) => entry.questionId === question.id);
  return {
    id,
    revision,
    status,
    mode: 'solo',
    serverNow: new Date(now).toISOString(),
    score: state.answers.reduce((sum, entry) => sum + entry.points, 0),
    rankDelta: state.answers.reduce((sum, entry) => sum + entry.rankDelta, 0),
    question: active
      ? {
          id: question.id,
          number: state.index + 1,
          total: 10,
          text: question.text,
          difficulty: question.difficulty,
          options: question.options,
          openedAt: new Date(state.openedAt).toISOString(),
          deadlineAt: new Date(state.deadlineAt).toISOString(),
          durationSeconds: RULES[question.difficulty].seconds,
          points: RULES[question.difficulty].score,
        }
      : null,
    feedback:
      active && answer && state.nextAt !== null
        ? {
            selected: answer.selected,
            correctOption: question.correctOption,
            correct: answer.correct,
            points: answer.points,
            rankDelta: answer.rankDelta,
            nextAt: new Date(state.nextAt).toISOString(),
          }
        : null,
    result: state.result,
  };
}
export function questionCounts(): Record<Difficulty, number> {
  return { asan: RULES.asan.count, orta: RULES.orta.count, çətin: RULES.çətin.count };
}
