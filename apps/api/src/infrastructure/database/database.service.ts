import { Injectable } from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Client } from 'pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly ownership: Client;
  private ownershipConnected = false;
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required. Run npm run db:prepare.');
    super({
      adapter: new PrismaPg({
        connectionString,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 10,
      }),
    });
    this.ownership = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  }
  async onModuleInit(): Promise<void> {
    try {
      await this.ownership.connect();
      this.ownershipConnected = true;
      const lock = await this.ownership.query<{ acquired: boolean }>(
        'SELECT pg_try_advisory_lock(246801357) AS acquired',
      );
      if (!lock.rows[0]?.acquired) {
        throw new Error('Another game server is running against this database.');
      }
      this.ownership.on('error', () => {
        process.exitCode = 1;
        process.kill(process.pid, 'SIGTERM');
      });
      await this.$connect();
      await this.match.updateMany({
        where: { activeUserId: { not: null } },
        data: {
          status: 'cancelled_server',
          activeUserId: null,
          dueAt: null,
          revision: { increment: 1 },
        },
      });
    } catch (error) {
      // Release the advisory lock even when Prisma startup or recovery fails.
      // Otherwise a failed boot can keep the process alive and block the next server.
      await Promise.allSettled([this.$disconnect(), this.ownership.end()]);
      this.ownershipConnected = false;
      throw error;
    }
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    if (this.ownershipConnected) {
      await this.ownership.end();
      this.ownershipConnected = false;
    }
  }
}
