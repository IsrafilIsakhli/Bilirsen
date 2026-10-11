import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { GamesController } from './transport/games.controller';
import { SoloService } from './application/solo.service';
@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [GamesController],
  providers: [SoloService],
})
export class GamesModule {}
