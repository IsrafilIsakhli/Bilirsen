import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GamesModule } from './modules/games/games.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthController } from './modules/health/health.controller';
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 240 }]),
    AuthModule,
    UsersModule,
    GamesModule,
    DatabaseModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
