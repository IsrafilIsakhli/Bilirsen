import { Controller, Get, Inject } from '@nestjs/common';
import { DatabaseService } from '../../infrastructure/database/database.service';

@Controller('health')
export class HealthController {
  constructor(@Inject(DatabaseService) private readonly db: DatabaseService) {}

  @Get() health() {
    return { status: 'ok', app: 'Bilirsən?', version: '0.1.0' };
  }

  @Get('ready') async ready() {
    await this.db.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'reachable' };
  }
}
