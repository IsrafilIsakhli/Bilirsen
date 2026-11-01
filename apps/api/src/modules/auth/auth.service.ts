import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { Session } from '@azquiz/contracts';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { ProfileService } from '../users/profile.service';

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
  constructor(
    @Inject(DatabaseService) private readonly db: DatabaseService,
    @Inject(ProfileService) private readonly profiles: ProfileService,
  ) {}
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
    return { ...tokens.public, profile: await this.profiles.read(id) };
  }
  async refresh(refreshToken: string): Promise<Session> {
    if (!/^[a-f0-9]{96}$/.test(refreshToken)) throw invalidSession();
    const refreshHash = hashToken(refreshToken);
    const refreshed = await this.db.$transaction(async (tx) => {
      const sessions = await tx.$queryRaw<
        Array<{
          id: string;
          userId: string;
          refreshHash: string;
          revoked: boolean;
          refreshExpiresAt: Date;
        }>
      >`
        SELECT id, "userId", "refreshHash", revoked, "refreshExpiresAt"
        FROM app.sessions
        WHERE "refreshHash" = ${refreshHash} OR ${refreshHash} = ANY("previousRefreshHashes")
        FOR UPDATE`;
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
    return { ...refreshed.tokens, profile: await this.profiles.read(refreshed.userId) };
  }
  async authenticate(authorization?: string): Promise<string> {
    if (!authorization || !/^Bearer [a-f0-9]{64}$/.test(authorization)) throw invalidSession();
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
