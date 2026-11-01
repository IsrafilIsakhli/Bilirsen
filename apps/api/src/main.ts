import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { z } from 'zod';
import { AppModule } from './app.module';
import { configureHttp } from './common/http-setup';
const config = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1),
  })
  .parse(process.env);
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  configureHttp(app, config.NODE_ENV);
  app.enableShutdownHooks();
  await app.listen(config.PORT, '0.0.0.0');
}
void bootstrap().catch(() => {
  console.error('Server could not start. Check local database setup and port availability.');
  process.exitCode = 1;
});
