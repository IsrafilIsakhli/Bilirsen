import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Profile, Session } from '@azquiz/contracts';
import { resultSchema } from '@azquiz/contracts';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { describeRank } from '../rankings/rank';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
const invalidSession = () =>
  new UnauthorizedException({
    code: 'session_expired',
    message: 'Sessiyanın vaxtı bitib. Yenidən daxil ol.',
  });

@Injectable()
export class AuthService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}
  async guest(): Promise<Session> {
    const id = randomUUID();
    const tokens = this.tokens();
    await this.db.$transaction(async (tx) => {
      await tx.user.create({
        data: { id, displayName: 'Qonaq', ranks: { create: [{ mode: 'solo' }, { mode: 'duel' }] } },
      });
      await tx.session.create({
        data: {
          id: randomUUID(),
          userId: id,
          ...tokens.stored,
          previousRefreshHashes: [],
          refreshExpiresAt: new Date(Date.now() + 30 * 86400000),
        },
      });
    });
    return { ...tokens.public, profile: await this.profile(id) };
  }
  async refresh(refreshToken: string): Promise<Session> {
    const refreshHash = hashToken(refreshToken);
    const refreshed = await this.db.$transaction(async (tx) => {
      const sessions = await tx.$queryRaw<
        Array<{
          id: string;
          userId: string;
          refreshHash: string;
          revoked: boolean;
          refreshExpiresAt: Date;
          previousRefreshHashes: string[];
        }>
      >`
        SELECT * FROM app.sessions WHERE "refreshHash" = ${refreshHash} OR ${refreshHash} = ANY("previousRefreshHashes") FOR UPDATE`;
      const session = sessions[0];
      if (!session || session.revoked || session.refreshExpiresAt.getTime() <= Date.now())
        return null;
      if (session.refreshHash !== refreshHash) {
        await tx.session.update({ where: { id: session.id }, data: { revoked: true } });
        return null;
      }
      const tokens = this.tokens();
      await tx.session.update({
        where: { id: session.id },
        data: { ...tokens.stored, previousRefreshHashes: { push: refreshHash } },
      });
      return { tokens: tokens.public, userId: session.userId };
    });
    if (!refreshed) throw invalidSession();
    return { ...refreshed.tokens, profile: await this.profile(refreshed.userId) };
  }
  async authenticate(authorization?: string): Promise<string> {
    if (!authorization?.startsWith('Bearer ') || authorization.length > 300) throw invalidSession();
    const session = await this.db.session.findUnique({
      where: { accessHash: hashToken(authorization.slice(7)) },
    });
    if (
      !session ||
      session.revoked ||
      session.accessExpiresAt.getTime() <= Date.now() ||
      session.refreshExpiresAt.getTime() <= Date.now()
    )
      throw invalidSession();
    return session.userId;
  }
  async profile(userId: string): Promise<Profile> {
    const user = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
      include: { ranks: true },
    });
    const results = await this.db.result.findMany({ where: { userId }, select: { payload: true } });
    const parsed = results.map((row) => resultSchema.parse(row.payload));
    return {
      id: user.id,
      displayName: user.displayName,
      isGuest: true,
      soloRank: describeRank(user.ranks.find((rank) => rank.mode === 'solo')?.points ?? 0),
      duelRank: describeRank(user.ranks.find((rank) => rank.mode === 'duel')?.points ?? 0),
      completedGames: parsed.filter((result) => result.reason === 'completed').length,
      correctAnswers: parsed.reduce((sum, result) => sum + result.correct, 0),
      answeredQuestions: parsed.reduce((sum, result) => sum + result.closedQuestions, 0),
    };
  }
  private tokens() {
    const accessToken = randomBytes(32).toString('hex');
    const refreshToken = randomBytes(48).toString('hex');
    const accessExpiresAt = new Date(Date.now() + 15 * 60000);
    return {
      public: { accessToken, refreshToken, expiresAt: accessExpiresAt.toISOString() },
      stored: {
        accessHash: hashToken(accessToken),
        refreshHash: hashToken(refreshToken),
        accessExpiresAt,
      },
    };
  }
}
