import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseService } from '../src/infrastructure/database/database.service';

describe('database startup resource cleanup', () => {
  let db: DatabaseService;
  const ownership = {
    connect: vi.fn(async () => undefined),
    query: vi.fn(async () => ({ rows: [{ acquired: true }] })),
    end: vi.fn(async () => undefined),
    on: vi.fn(),
  };

  beforeEach(() => {
    vi.stubEnv('DATABASE_URL', 'postgresql://unused:unused@127.0.0.1:1/unused');
    db = new DatabaseService();
    Object.defineProperty(db, 'ownership', { value: ownership });
    vi.spyOn(db, '$connect').mockResolvedValue();
    vi.spyOn(db, '$disconnect').mockResolvedValue();
    vi.spyOn(db.match, 'updateMany').mockResolvedValue({ count: 0 });
  });
  afterEach(async () => {
    await db.onModuleDestroy();
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('releases ownership if startup recovery fails and preserves the original failure', async () => {
    const failure = new Error('startup-recovery-failed');
    vi.mocked(db.match.updateMany).mockRejectedValueOnce(failure);
    await expect(db.onModuleInit()).rejects.toBe(failure);
    expect(ownership.end).toHaveBeenCalledOnce();
    expect(db.$disconnect).toHaveBeenCalledOnce();
    await db.onModuleDestroy();
    expect(ownership.end).toHaveBeenCalledOnce();
  });

  it('closes the ownership client when its connection fails before acquiring a lock', async () => {
    const failure = new Error('connection-unavailable');
    ownership.connect.mockRejectedValueOnce(failure);
    await expect(db.onModuleInit()).rejects.toBe(failure);
    expect(ownership.query).not.toHaveBeenCalled();
    expect(ownership.end).toHaveBeenCalledOnce();
    expect(db.match.updateMany).not.toHaveBeenCalled();
  });

  it('rejects a second server before touching active matches', async () => {
    ownership.query.mockResolvedValueOnce({ rows: [{ acquired: false }] });
    await expect(db.onModuleInit()).rejects.toThrow('Another game server');
    expect(db.$connect).not.toHaveBeenCalled();
    expect(db.match.updateMany).not.toHaveBeenCalled();
    expect(ownership.end).toHaveBeenCalled();
  });
});
