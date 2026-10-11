import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import type { AnswerCommand, GameSnapshot } from '@azquiz/contracts';
import { gameSchema } from '@azquiz/contracts';
import type { Prisma, Match } from '../../../generated/prisma/client';
import { DatabaseService } from '../../../infrastructure/database/database.service';
import { selectQuestions } from '../../questions/selection';
import {
  advanceSolo,
  createSolo,
  finishSolo,
  GameRuleError,
  snapshot,
  soloStateSchema,
  submitAnswer,
} from '../domain/solo';
import type { SoloState, MatchStatus } from '../domain/solo';

type Transaction = Prisma.TransactionClient;
@Injectable()
export class SoloService implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  private ticking = false;
  private interrupted = false;
  private readonly logger = new Logger(SoloService.name);
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}
  onModuleInit(): void {
    this.timer = setInterval(() => {
      void this.tick();
    }, 500);
  }
  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
  async start(userId: string, commandId: string): Promise<GameSnapshot> {
    return this.command(userId, commandId, 'start', async (tx) => {
      const active = await tx.match.findUnique({ where: { activeUserId: userId } });
      if (active) return this.advance(tx, active, Date.now());
      const records = await tx.questionVersion.findMany({
        where: { releaseStatus: process.env.NODE_ENV === 'production' ? 'approved' : 'test_only' },
      });
      const recent = await tx.match.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      const recentIds = new Set(
        recent.flatMap((match) =>
          soloStateSchema.parse(match.state).questions.map((q) => q.bankId),
        ),
      );
      const now = Date.now();
      const state = createSolo(selectQuestions(records, recentIds), now);
      const match = await tx.match.create({
        data: {
          id: randomUUID(),
          userId,
          activeUserId: userId,
          status: 'question_open',
          state,
          dueAt: new Date(state.deadlineAt),
        },
      });
      return snapshot(match.id, match.revision, 'question_open', state, now);
    });
  }
  async active(userId: string): Promise<GameSnapshot | null> {
    return this.db.$transaction(async (tx) => {
      await this.lockUser(tx, userId);
      const match = await tx.match.findUnique({ where: { activeUserId: userId } });
      return match ? this.advance(tx, match, Date.now()) : null;
    });
  }
  async read(userId: string, matchId: string): Promise<GameSnapshot> {
    return this.db.$transaction(async (tx) => {
      await this.lockUser(tx, userId);
      return this.advance(tx, await this.ownedMatch(tx, userId, matchId), Date.now());
    });
  }
  async answer(
    userId: string,
    matchId: string,
    body: AnswerCommand,
    receivedAt: number,
  ): Promise<GameSnapshot> {
    return this.command(
      userId,
      body.commandId,
      `answer:${matchId}:${body.questionId}:${body.option}`,
      async (tx) => {
        const match = await this.ownedMatch(tx, userId, matchId);
        if (!match.activeUserId) throw new GameRuleError('game_finished', 'Yarış artıq bağlanıb.');
        const state = soloStateSchema.parse(match.state);
        submitAnswer(state, body.questionId, body.option, receivedAt);
        return this.persist(tx, match, state, 'question_closed', Date.now());
      },
    );
  }
  async leave(userId: string, matchId: string, commandId: string): Promise<GameSnapshot> {
    return this.command(userId, commandId, `leave:${matchId}`, async (tx) => {
      const match = await this.ownedMatch(tx, userId, matchId);
      const state = soloStateSchema.parse(match.state);
      if (!match.activeUserId)
        return snapshot(match.id, match.revision, this.status(match), state, Date.now());
      await this.settle(tx, match, state, 'abandoned', Date.now());
      return this.persist(tx, match, state, 'finished', Date.now());
    });
  }
  private async command(
    userId: string,
    commandId: string,
    fingerprint: string,
    action: (tx: Transaction) => Promise<GameSnapshot>,
  ): Promise<GameSnapshot> {
    const hash = createHash('sha256').update(fingerprint).digest('hex');
    return this.db.$transaction(
      async (tx) => {
        await this.lockUser(tx, userId);
        const receipt = await tx.commandReceipt.findUnique({
          where: { userId_commandId: { userId, commandId } },
        });
        if (receipt) {
          if (receipt.fingerprint !== hash)
            throw new GameRuleError(
              'command_conflict',
              'Eyni əmrlə fərqli məlumat göndərilə bilməz.',
            );
          return gameSchema.parse(receipt.response);
        }
        const response = await action(tx);
        await tx.commandReceipt.create({
          data: { userId, commandId, fingerprint: hash, response },
        });
        return response;
      },
      { timeout: 10000 },
    );
  }
  private async lockUser(tx: Transaction, userId: string): Promise<void> {
    await tx.$queryRaw`SELECT id FROM app.users WHERE id = ${userId}::uuid FOR UPDATE`;
  }
  private async ownedMatch(tx: Transaction, userId: string, id: string): Promise<Match> {
    const match = await tx.match.findFirst({ where: { id, userId } });
    if (!match)
      throw new NotFoundException({ code: 'game_not_found', message: 'Yarış tapılmadı.' });
    return match;
  }
  private status(match: Match): MatchStatus {
    return gameSchema.shape.status.parse(match.status);
  }
  private async advance(tx: Transaction, match: Match, now: number): Promise<GameSnapshot> {
    const state = soloStateSchema.parse(match.state);
    if (!match.activeUserId)
      return snapshot(match.id, match.revision, this.status(match), state, now);
    const change = advanceSolo(state, now);
    if (change === 'unchanged')
      return snapshot(match.id, match.revision, this.status(match), state, now);
    if (change === 'settle') {
      await this.settle(tx, match, state, 'completed', now);
      return this.persist(tx, match, state, 'finished', now);
    }
    return this.persist(
      tx,
      match,
      state,
      state.nextAt === null ? 'question_open' : 'question_closed',
      now,
    );
  }
  private async settle(
    tx: Transaction,
    match: Match,
    state: SoloState,
    reason: 'completed' | 'abandoned',
    now: number,
  ): Promise<void> {
    const rank = await tx.rank.findUniqueOrThrow({
      where: { userId_mode: { userId: match.userId, mode: 'solo' } },
    });
    const result = finishSolo(state, rank.points, reason, now);
    await tx.result.create({
      data: { matchId: match.id, userId: match.userId, payload: result, finishedAt: new Date(now) },
    });
    await tx.rankLedger.create({
      data: {
        matchId: match.id,
        userId: match.userId,
        mode: 'solo',
        previousPoints: rank.points,
        theoreticalDelta: result.theoreticalDelta,
        actualDelta: result.actualDelta,
        points: result.rank.points,
      },
    });
    await tx.rank.update({
      where: { userId_mode: { userId: match.userId, mode: 'solo' } },
      data: { points: result.rank.points },
    });
  }
  private async persist(
    tx: Transaction,
    match: Match,
    state: SoloState,
    status: MatchStatus,
    now: number,
  ): Promise<GameSnapshot> {
    const finished = status === 'finished' || status === 'cancelled_server';
    const saved = await tx.match.update({
      where: { id: match.id },
      data: {
        state,
        status,
        revision: { increment: 1 },
        activeUserId: finished ? null : match.userId,
        dueAt: finished ? null : new Date(state.nextAt ?? state.deadlineAt),
      },
    });
    return snapshot(saved.id, saved.revision, status, state, now);
  }
  private async tick(): Promise<void> {
    if (this.ticking) return;
    this.ticking = true;
    try {
      if (this.interrupted) {
        const pending = await this.db.match.findMany({
          where: { activeUserId: { not: null } },
          select: { id: true, userId: true },
        });
        for (const match of pending)
          await this.db.$transaction(async (tx) => {
            await this.lockUser(tx, match.userId);
            await tx.match.updateMany({
              where: { id: match.id, activeUserId: { not: null } },
              data: {
                status: 'cancelled_server',
                activeUserId: null,
                dueAt: null,
                revision: { increment: 1 },
              },
            });
          });
        this.interrupted = false;
      }
      const due = await this.db.match.findMany({
        where: { activeUserId: { not: null }, dueAt: { lte: new Date() } },
        select: { id: true, userId: true },
        take: 100,
      });
      for (const match of due) await this.read(match.userId, match.id);
    } catch (error) {
      if (!this.interrupted)
        this.logger.error(
          'Game scheduler interrupted',
          error instanceof Error ? error.constructor.name : 'UnknownError',
        );
      this.interrupted = true;
    } finally {
      this.ticking = false;
    }
  }
}
