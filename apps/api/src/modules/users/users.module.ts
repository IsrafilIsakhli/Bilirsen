import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MeController } from './me.controller';
@Module({ imports: [DatabaseModule, AuthModule], controllers: [MeController] })
export class UsersModule {}
