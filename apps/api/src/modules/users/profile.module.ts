import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ProfileService } from './profile.service';

// Shared read model without an authentication-module dependency.
@Module({
  imports: [DatabaseModule],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
