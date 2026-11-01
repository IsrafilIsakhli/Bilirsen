import { Inject, Injectable } from '@nestjs/common';
import type { Profile } from '@azquiz/contracts';
import { profileSchema } from '@azquiz/contracts';
import { z } from 'zod';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { describeRank } from '../rankings/rank';

const statisticsSchema = z.object({
  completedGames: z.coerce.number().int().nonnegative(),
  correctAnswers: z.coerce.number().int().nonnegative(),
  answeredQuestions: z.coerce.number().int().nonnegative(),
  invalidResults: z.coerce.number().pipe(z.literal(0)),
});

@Injectable()
export class ProfileService {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}
  async read(userId: string): Promise<Profile> {
    return this.db.$transaction(
      async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
          where: { id: userId },
          select: { id: true, displayName: true, ranks: { select: { mode: true, points: true } } },
        });
        // Aggregate in PostgreSQL instead of transferring every historical result to the API.
        const rows = await tx.$queryRaw<unknown>`
          SELECT
            (COUNT(*) FILTER (WHERE payload->>'reason' = 'completed'))::text AS "completedGames",
            COALESCE(SUM((payload->>'correct')::bigint), 0)::text AS "correctAnswers",
            COALESCE(SUM((payload->>'closedQuestions')::bigint), 0)::text AS "answeredQuestions",
            (COUNT(*) FILTER (WHERE
              jsonb_typeof(payload->'correct') IS DISTINCT FROM 'number'
              OR jsonb_typeof(payload->'closedQuestions') IS DISTINCT FROM 'number'
              OR COALESCE(payload->>'reason', '') NOT IN ('completed', 'abandoned')
              OR (payload->>'correct')::bigint NOT BETWEEN 0 AND 10
              OR (payload->>'closedQuestions')::bigint NOT BETWEEN 0 AND 10
              OR (payload->>'correct')::bigint > (payload->>'closedQuestions')::bigint
              OR (payload->>'reason' = 'completed' AND (payload->>'closedQuestions')::bigint <> 10)
            ))::text AS "invalidResults"
          FROM app.match_results WHERE "userId" = ${userId}::uuid`;
        const [statistics] = z.array(statisticsSchema).length(1).parse(rows);
        if (!statistics) throw new Error('Profile statistics were not returned');
        const solo = user.ranks.find((rank) => rank.mode === 'solo');
        const duel = user.ranks.find((rank) => rank.mode === 'duel');
        if (!solo || !duel) throw new Error('Player ranks are incomplete');
        return profileSchema.parse({
          id: user.id,
          displayName: user.displayName,
          isGuest: true,
          soloRank: describeRank(solo.points),
          duelRank: describeRank(duel.points),
          completedGames: statistics.completedGames,
          correctAnswers: statistics.correctAnswers,
          answeredQuestions: statistics.answeredQuestions,
        });
      },
      // Rank and counters must describe the same committed database snapshot.
      { isolationLevel: 'RepeatableRead' },
    );
  }
}
