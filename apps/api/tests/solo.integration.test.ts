import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { sessionSchema, gameSchema, profileSchema } from '@azquiz/contracts';
import type { Session, GameSnapshot } from '@azquiz/contracts';
import { soloStateSchema } from '../src/modules/games/domain/solo';

const enabled = process.env.RUN_INTEGRATION === '1';
describe.skipIf(!enabled)('live solo API + PostgreSQL', () => {
  let db: PrismaClient;
  let player: Session;
  let other: Session;
  const userIds: string[] = [];
  async function call(path: string, session: Session | null, body?: unknown) {
    const response = await fetch(`http://127.0.0.1:3000/v1${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, payload: (await response.json()) as unknown };
  }
  async function guest() {
    const response = await call('/auth/guest', null, {});
    expect(response.status).toBe(201);
    const session = sessionSchema.parse(response.payload);
    userIds.push(session.profile.id);
    return session;
  }
  async function getGame(id: string, session = player): Promise<GameSnapshot> {
    return gameSchema.parse((await call(`/games/${id}`, session)).payload);
  }
  beforeAll(async () => {
    const config = await readFile('apps/api/.env.local', 'utf8');
    const connectionString = config.match(/^DATABASE_URL=(.+)$/m)?.[1];
    if (!connectionString) throw new Error('Missing local test connection');
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    player = await guest();
    other = await guest();
  });
  afterAll(async () => {
    if (!db) return;
    await db.$transaction(async (tx) => {
      await tx.commandReceipt.deleteMany({ where: { userId: { in: userIds } } });
      await tx.rankLedger.deleteMany({ where: { userId: { in: userIds } } });
      await tx.result.deleteMany({ where: { userId: { in: userIds } } });
      await tx.match.deleteMany({ where: { userId: { in: userIds } } });
      await tx.session.deleteMany({ where: { userId: { in: userIds } } });
      await tx.rank.deleteMany({ where: { userId: { in: userIds } } });
      await tx.user.deleteMany({ where: { id: { in: userIds } } });
    });
    await db.$disconnect();
  });
  it('isolates players, serializes duplicate commands, and settles a complete game exactly once', async () => {
    const commandId = randomUUID();
    const starts = await Promise.all(
      Array.from({ length: 5 }, () => call('/games/solo', player, { commandId })),
    );
    const game = gameSchema.parse(starts[0]?.payload);
    expect(
      starts.every(
        (response) => response.status === 201 && gameSchema.parse(response.payload).id === game.id,
      ),
    ).toBe(true);
    expect((await call(`/games/${game.id}`, other)).status).toBe(404);
    expect(
      (
        await call(`/games/${game.id}/answers`, other, {
          commandId: randomUUID(),
          questionId: game.question?.id,
          option: 'A',
        })
      ).status,
    ).toBe(404);
    expect(await db.match.count({ where: { activeUserId: player.profile.id } })).toBe(1);
    let current = game;
    for (let index = 0; index < 10; index++) {
      const row = await db.match.findUniqueOrThrow({ where: { id: game.id } });
      const privateState = soloStateSchema.parse(row.state);
      const question = privateState.questions[privateState.index];
      if (!question || !current.question) throw new Error('Missing current question');
      expect(current.feedback).toBeNull();
      expect(current.question).not.toHaveProperty('correctOption');
      const body = {
        commandId: randomUUID(),
        questionId: question.id,
        option: question.correctOption,
      };
      const submissions = await Promise.all(
        Array.from({ length: 4 }, () => call(`/games/${game.id}/answers`, player, body)),
      );
      expect(submissions.every((response) => response.status === 201)).toBe(true);
      expect(
        (
          await call(`/games/${game.id}/answers`, player, {
            ...body,
            option: question.correctOption === 'A' ? 'B' : 'A',
          })
        ).status,
      ).toBe(409);
      const closed = gameSchema.parse(submissions[0]?.payload);
      expect(closed.feedback?.correct).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 1700));
      current = await getGame(game.id);
    }
    const repeated = await Promise.all(Array.from({ length: 5 }, () => getGame(game.id)));
    expect(repeated.every((view) => view.status === 'finished' && view.result?.score === 255)).toBe(
      true,
    );
    expect(current.result).toMatchObject({ correct: 10, theoreticalDelta: 86, actualDelta: 86 });
    expect(await db.result.count({ where: { matchId: game.id } })).toBe(1);
    expect(await db.rankLedger.count({ where: { matchId: game.id } })).toBe(1);
    expect(await db.match.count({ where: { activeUserId: player.profile.id } })).toBe(0);
    const me = profileSchema.parse((await call('/me', player)).payload);
    expect(me.soloRank.points).toBe(86);
    expect(me.duelRank.points).toBe(0);
    expect(me.completedGames).toBe(1);
  });
  it('rejects expired answers, records no timeout penalty and closes without duplicate rank updates', async () => {
    const start = gameSchema.parse(
      (await call('/games/solo', other, { commandId: randomUUID() })).payload,
    );
    const row = await db.match.findUniqueOrThrow({ where: { id: start.id } });
    const state = soloStateSchema.parse(row.state);
    state.deadlineAt = Date.now() - 1;
    await db.match.update({
      where: { id: start.id },
      data: { state, dueAt: new Date(state.deadlineAt) },
    });
    expect(
      (
        await call(`/games/${start.id}/answers`, other, {
          commandId: randomUUID(),
          questionId: start.question?.id,
          option: 'A',
        })
      ).status,
    ).toBe(409);
    const timedOut = await getGame(start.id, other);
    expect(timedOut.feedback).toMatchObject({ selected: null, rankDelta: 0, points: 0 });
    const commandId = randomUUID();
    const leaves = await Promise.all(
      Array.from({ length: 5 }, () => call(`/games/${start.id}/leave`, other, { commandId })),
    );
    expect(
      leaves.every((response) => gameSchema.parse(response.payload).result?.actualDelta === 0),
    ).toBe(true);
    expect(await db.rankLedger.count({ where: { matchId: start.id } })).toBe(1);
  });
  it('rotates sessions and revokes the token family on refresh replay', async () => {
    const refreshed = await call('/auth/refresh', null, { refreshToken: player.refreshToken });
    expect(refreshed.status).toBe(201);
    const newSession = sessionSchema.parse(refreshed.payload);
    expect(newSession.profile.id).toBe(player.profile.id);
    expect((await call('/me', newSession)).status).toBe(200);
    expect((await call('/auth/refresh', null, { refreshToken: player.refreshToken })).status).toBe(
      401,
    );
    expect((await call('/me', newSession)).status).toBe(401);
  });
});
