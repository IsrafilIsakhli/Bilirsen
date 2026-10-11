import { z } from 'zod';

export const optionSchema = z.enum(['A', 'B', 'C', 'D']);
export const difficultySchema = z.enum(['asan', 'orta', 'çətin']);
export const rankSchema = z.object({
  points: z.number().int().nonnegative(),
  name: z.string(),
  division: z.enum(['III', 'II', 'I']),
  progress: z.number().nonnegative(),
  span: z.number().positive(),
  nextAt: z.number().nullable(),
});
export const profileSchema = z.object({
  id: z.uuid(),
  displayName: z.string(),
  isGuest: z.boolean(),
  soloRank: rankSchema,
  duelRank: rankSchema,
  completedGames: z.number().int().nonnegative(),
  correctAnswers: z.number().int().nonnegative(),
  answeredQuestions: z.number().int().nonnegative(),
});
export const sessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.iso.datetime(),
  profile: profileSchema,
});
export const questionSchema = z.object({
  id: z.uuid(),
  number: z.number().int().positive(),
  total: z.literal(10),
  text: z.string(),
  difficulty: difficultySchema,
  options: z.array(z.object({ key: optionSchema, text: z.string() })).length(4),
  openedAt: z.iso.datetime(),
  deadlineAt: z.iso.datetime(),
  durationSeconds: z.number().positive(),
  points: z.number().positive(),
});
export const feedbackSchema = z.object({
  selected: optionSchema.nullable(),
  correctOption: optionSchema,
  correct: z.boolean(),
  points: z.number().nonnegative(),
  rankDelta: z.number().int(),
  nextAt: z.iso.datetime(),
});
export const resultSchema = z.object({
  score: z.number().int().nonnegative(),
  maximumScore: z.literal(255),
  correct: z.number().int().nonnegative(),
  closedQuestions: z.number().int().nonnegative(),
  totalQuestions: z.literal(10),
  reason: z.enum(['completed', 'abandoned']),
  theoreticalDelta: z.number().int(),
  actualDelta: z.number().int(),
  previousRank: rankSchema,
  rank: rankSchema,
  finishedAt: z.iso.datetime(),
});
export const gameSchema = z.object({
  id: z.uuid(),
  revision: z.number().int().nonnegative(),
  mode: z.literal('solo'),
  status: z.enum(['question_open', 'question_closed', 'finished', 'cancelled_server']),
  serverNow: z.iso.datetime(),
  score: z.number().int().nonnegative(),
  rankDelta: z.number().int(),
  question: questionSchema.nullable(),
  feedback: feedbackSchema.nullable(),
  result: resultSchema.nullable(),
});
export const historySchema = z.array(
  z.object({ id: z.uuid(), mode: z.literal('solo'), result: resultSchema }),
);
export const activeGameSchema = z.object({ game: gameSchema.nullable() });
export const errorSchema = z.object({ code: z.string(), message: z.string() });
export const commandSchema = z.object({ commandId: z.uuid() }).strict();
export const answerSchema = commandSchema
  .extend({ questionId: z.uuid(), option: optionSchema })
  .strict();
export const refreshSchema = z.object({ refreshToken: z.string().min(32).max(256) }).strict();

export type OptionKey = z.infer<typeof optionSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type Rank = z.infer<typeof rankSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type GameSnapshot = z.infer<typeof gameSchema>;
export type GameResult = z.infer<typeof resultSchema>;
export type AnswerCommand = z.infer<typeof answerSchema>;
