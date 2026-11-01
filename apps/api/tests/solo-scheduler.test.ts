import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Match } from '../src/generated/prisma/client';
import { gameSchema } from '@azquiz/contracts';
import { DatabaseService } from '../src/infrastructure/database/database.service';
import { SoloService } from '../src/modules/games/application/solo.service';

function scheduledMatch(): Match {
  const userId = randomUUID();
  return {
    id: randomUUID(),
    userId,
    activeUserId: userId,
    status: 'question_open',
    state: {},
    revision: 0,
    dueAt: new Date(0),
    createdAt: new Date(0),
  };
}

describe('solo scheduler failure isolation', () => {
  let db: DatabaseService;
  let service: SoloService;
  const view = gameSchema.parse({
    id: randomUUID(),
    mode: 'solo',
    revision: 0,
    status: 'cancelled_server',
    serverNow: new Date(0).toISOString(),
    score: 0,
    rankDelta: 0,
    question: null,
    feedback: null,
    result: null,
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('DATABASE_URL', 'postgresql://unused:unused@127.0.0.1:1/unused');
    // The Prisma adapter is constructed but never connected. All I/O is replaced below.
    db = new DatabaseService();
    service = new SoloService(db);
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    vi.spyOn(db, '$transaction').mockImplementation(async (operation) => operation(db));
    vi.spyOn(db, '$queryRaw').mockResolvedValue([]);
    vi.spyOn(db.match, 'updateMany').mockResolvedValue({ count: 1 });
  });
  afterEach(async () => {
    service.onModuleDestroy();
    await db.$disconnect();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('cancels only a failed match and still advances a healthy match in the same batch', async () => {
    const failed = scheduledMatch();
    const healthy = scheduledMatch();
    const due = vi.spyOn(db.match, 'findMany').mockResolvedValue([]);
    due.mockResolvedValueOnce([failed, healthy]);
    const advance = vi.spyOn(service, 'read').mockResolvedValue(view);
    advance.mockRejectedValueOnce(new Error('private-persisted-state-details'));
    service.onModuleInit();
    await vi.advanceTimersByTimeAsync(1500);
    expect(advance.mock.calls).toEqual([
      [failed.userId, failed.id],
      [healthy.userId, healthy.id],
    ]);
    expect(db.match.updateMany).toHaveBeenCalledExactlyOnceWith({
      where: { id: failed.id, userId: failed.userId, activeUserId: failed.userId },
      data: {
        status: 'cancelled_server',
        activeUserId: null,
        dueAt: null,
        revision: { increment: 1 },
      },
    });
    expect(due.mock.calls.every(([query]) => query?.where?.dueAt !== undefined)).toBe(true);
    expect(Logger.prototype.error).toHaveBeenCalledWith({
      event: 'scheduled_match_failed',
      matchId: failed.id,
      errorType: 'Error',
    });
  });

  it('retains cancellation after a scheduler-wide database interruption', async () => {
    const first = scheduledMatch();
    const second = scheduledMatch();
    const due = vi.spyOn(db.match, 'findMany').mockResolvedValue([]);
    due.mockRejectedValueOnce(new Error('connection unavailable'));
    due.mockResolvedValueOnce([first, second]);
    const advance = vi.spyOn(service, 'read').mockResolvedValue(view);
    service.onModuleInit();
    await vi.advanceTimersByTimeAsync(1000);
    expect(advance).not.toHaveBeenCalled();
    expect(db.match.updateMany).toHaveBeenCalledTimes(2);
    expect(db.match.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: first.id, userId: first.userId, activeUserId: first.userId },
      }),
    );
    expect(db.match.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: second.id, userId: second.userId, activeUserId: second.userId },
      }),
    );
  });

  it('does not overlap timer batches while a game transaction is still pending', async () => {
    const match = scheduledMatch();
    const due = vi.spyOn(db.match, 'findMany').mockResolvedValue([]);
    due.mockResolvedValueOnce([match]);
    let release: ((value: typeof view) => void) | undefined;
    const pending = new Promise<typeof view>((resolve) => {
      release = resolve;
    });
    const advance = vi.spyOn(service, 'read').mockReturnValueOnce(pending);
    service.onModuleInit();
    await vi.advanceTimersByTimeAsync(1500);
    expect(due).toHaveBeenCalledTimes(1);
    expect(advance).toHaveBeenCalledTimes(1);
    if (!release) throw new Error('Missing pending transaction');
    release(view);
    await vi.advanceTimersByTimeAsync(500);
    expect(due).toHaveBeenCalledTimes(2);
  });
});
