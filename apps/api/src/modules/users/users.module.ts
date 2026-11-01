import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MeController } from './me.controller';
import { ProfileModule } from './profile.module';
@Module({ imports: [DatabaseModule, AuthModule, ProfileModule], controllers: [MeController] })
export class UsersModule {}
