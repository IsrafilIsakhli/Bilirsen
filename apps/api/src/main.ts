import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { AppModule } from './app.module';
import { ApiErrorFilter } from './common/api-error.filter';
const config = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1),
  })
  .parse(process.env);
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.use((req: Request & { receivedAt?: number }, _res: Response, next: NextFunction) => {
    req.receivedAt = Date.now();
    next();
  });
  app.use(helmet());
  if (config.NODE_ENV === 'development') app.enableCors({ origin: true });
  app.useGlobalFilters(new ApiErrorFilter());
  app.enableShutdownHooks();
  await app.listen(config.PORT, '0.0.0.0');
}
void bootstrap().catch(() => {
  console.error('Server could not start. Check local database setup and port availability.');
  process.exitCode = 1;
});
