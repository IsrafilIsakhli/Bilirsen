import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { resultSchema } from '@azquiz/contracts';
@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(DatabaseService) private readonly db: DatabaseService,
  ) {}
  @Get() profile(@Req() req: AuthenticatedRequest) {
    return this.auth.profile(req.userId);
  }
  @Get('history') async history(@Req() req: AuthenticatedRequest) {
    const results = await this.db.result.findMany({
      where: { userId: req.userId },
      orderBy: { finishedAt: 'desc' },
      take: 20,
    });
    return results.map((row) => ({
      id: row.matchId,
      mode: 'solo' as const,
      result: resultSchema.parse(row.payload),
    }));
  }
}
