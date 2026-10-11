import { Controller, Get, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GamesModule } from './modules/games/games.module';
@Controller('health')
class HealthController {
  @Get() health() {
    return { status: 'ok', app: 'Bilirsən?', version: '0.1.0' };
  }
}
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 240 }]),
    AuthModule,
    UsersModule,
    GamesModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
