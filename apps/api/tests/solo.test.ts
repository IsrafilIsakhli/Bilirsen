import { describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import {
  advanceSolo,
  createSolo,
  currentQuestion,
  finishSolo,
  snapshot,
  submitAnswer,
} from '../src/modules/games/domain/solo';
import type { PrivateQuestion } from '../src/modules/games/domain/solo';
import { describeRank } from '../src/modules/rankings/rank';
import { selectQuestionBankIds, selectQuestions } from '../src/modules/questions/selection';

function questions(): PrivateQuestion[] {
  return ['asan', 'asan', 'orta', 'orta', 'orta', 'orta', 'orta', 'çətin', 'çətin', 'çətin'].map(
    (difficulty, index) => ({
      id: randomUUID(),
      bankId: `test-${index}`,
      factKey: `fact-${index}`,
      category: 'Test',
      difficulty: difficulty as PrivateQuestion['difficulty'],
      text: 'Test question',
      options: [
        { key: 'A', text: 'Right' },
        { key: 'B', text: 'Wrong1' },
        { key: 'C', text: 'Wrong2' },
        { key: 'D', text: 'Wrong3' },
      ],
      correctOption: 'A',
    }),
  );
}
describe('solo rules', () => {
  it('selects metadata first, preserving difficulty and avoiding recent facts without answer bodies', () => {
    const candidates = Array.from({ length: 3 }, (_, cycle) =>
      questions().map((q) => ({
        bankId: `${cycle}-${q.bankId}`,
        factKey: `${cycle}-${q.factKey}`,
        difficulty: q.difficulty,
        category: q.category,
      })),
    ).flat();
    const recent = new Set(
      candidates.filter((q) => q.bankId.startsWith('0-')).map((q) => q.bankId),
    );
    const ids = selectQuestionBankIds(candidates, recent);
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
    expect(ids.every((id) => !recent.has(id))).toBe(true);
    const selected = candidates.filter((q) => ids.includes(q.bankId));
    expect(selected.filter((q) => q.difficulty === 'asan')).toHaveLength(2);
    expect(selected.filter((q) => q.difficulty === 'orta')).toHaveLength(5);
    expect(selected.filter((q) => q.difficulty === 'çətin')).toHaveLength(3);
    expect(() =>
      selectQuestionBankIds(
        candidates.filter((q) => q.difficulty !== 'çətin'),
        recent,
      ),
    ).toThrow('hazır deyil');
  });
  it('balances topic variety when a sufficiently diverse pool exists', () => {
    const records = Array.from({ length: 4 }, (_, cycle) =>
      questions().map((q, index) => ({
        ...q,
        category: `topic-${index}`,
        bankId: `${cycle}-${q.bankId}`,
        factKey: `${cycle}-${q.factKey}`,
        options: { A: 'Right', B: 'Wrong1', C: 'Wrong2', D: 'Wrong3' },
      })),
    ).flat();
    expect(new Set(selectQuestions(records, new Set()).map((q) => q.category)).size).toBe(10);
  });
  it('requires ten distinct facts and the agreed difficulty distribution', () => {
    const pool = questions();
    const first = pool[0];
    const second = pool[1];
    if (!first || !second) throw new Error('Invalid fixture');
    second.factKey = first.factKey;
    expect(() => createSolo(pool, 0)).toThrow('fərqli sual');
  });
  it('never exposes answer keys or future questions while open', () => {
    const state = createSolo(questions(), 0);
    const view = snapshot(randomUUID(), 0, 'question_open', state, 0);
    expect(view.feedback).toBeNull();
    expect(view.question).not.toHaveProperty('correctOption');
    expect(view).not.toHaveProperty('questions');
    expect(view.result).toBeNull();
  });
  it('accepts before deadline and rejects at the exact deadline', () => {
    const state = createSolo(questions(), 0);
    expect(() => submitAnswer(state, currentQuestion(state).id, 'A', state.deadlineAt)).toThrow(
      'vaxtı bitib',
    );
    submitAnswer(state, currentQuestion(state).id, 'A', state.deadlineAt - 1);
    expect(state.answers[0]?.points).toBe(20);
    expect(state.answers[0]?.rankDelta).toBe(5);
    expect(() => submitAnswer(state, currentQuestion(state).id, 'B', state.deadlineAt - 1)).toThrow(
      'artıq bağlanıb',
    );
  });
  it('closes unanswered questions without any penalty and advances by server time', () => {
    const state = createSolo(questions(), 0);
    expect(advanceSolo(state, 20000)).toBe('changed');
    expect(state.answers[0]).toMatchObject({ selected: null, rankDelta: 0, points: 0 });
    expect(advanceSolo(state, 21599)).toBe('unchanged');
    expect(advanceSolo(state, 21600)).toBe('changed');
    expect(state.index).toBe(1);
    expect(state.deadlineAt).toBe(41600);
  });
  it('settles maximum match score 255 and solo rank +86 separately', () => {
    const state = createSolo(questions(), 0);
    for (let index = 0; index < 10; index++) {
      submitAnswer(state, currentQuestion(state).id, 'A', state.openedAt + 1);
      const change = advanceSolo(state, state.nextAt ?? 0);
      expect(change).toBe(index === 9 ? 'settle' : 'changed');
    }
    const result = finishSolo(state, 20, 'completed', 100000);
    expect(result).toMatchObject({
      score: 255,
      theoreticalDelta: 86,
      actualDelta: 86,
      correct: 10,
    });
    expect(result.rank.points).toBe(106);
  });
  it('applies the zero floor once at settlement, including explicit abandonment', () => {
    const state = createSolo(questions(), 0);
    submitAnswer(state, currentQuestion(state).id, 'B', 1);
    advanceSolo(state, state.nextAt ?? 0);
    submitAnswer(state, currentQuestion(state).id, 'A', state.openedAt + 1);
    const result = finishSolo(state, 0, 'abandoned', 5000);
    expect(result.actualDelta).toBe(2);
    expect(result.rank.points).toBe(2);
    expect(result.closedQuestions).toBe(2);
    const negative = createSolo(questions(), 0);
    submitAnswer(negative, currentQuestion(negative).id, 'B', 1);
    expect(finishSolo(negative, 1, 'abandoned', 2)).toMatchObject({
      theoreticalDelta: -3,
      actualDelta: -1,
    });
  });
  it('maps rank boundaries and the final division without losing overflow', () => {
    expect(describeRank(99)).toMatchObject({ name: 'Şagird', division: 'III', progress: 99 });
    expect(describeRank(100)).toMatchObject({ name: 'Şagird', division: 'II', progress: 0 });
    expect(describeRank(750)).toMatchObject({ name: 'Alim', division: 'III' });
    expect(describeRank(3000)).toMatchObject({
      name: 'Əllamə',
      division: 'I',
      nextAt: null,
      points: 3000,
    });
  });
  it('preserves correct text through option shuffling and excludes recent questions where possible', () => {
    const records = Array.from({ length: 3 }, (_, cycle) =>
      questions().map((q) => ({
        ...q,
        bankId: `${cycle}-${q.bankId}`,
        factKey: `${cycle}-${q.factKey}`,
        options: { A: 'Right', B: 'Wrong1', C: 'Wrong2', D: 'Wrong3' },
      })),
    ).flat();
    const recent = new Set(records.filter((q) => q.bankId.startsWith('0-')).map((q) => q.bankId));
    for (let i = 0; i < 10; i++) {
      const selected = selectQuestions(records, recent);
      expect(selected).toHaveLength(10);
      for (const q of selected) {
        expect(recent.has(q.bankId)).toBe(false);
        expect(q.options.find((option) => option.key === q.correctOption)?.text).toBe('Right');
      }
    }
  });
});
