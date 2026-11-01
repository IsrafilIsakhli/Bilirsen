import { randomUUID } from 'node:crypto';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { ApiErrorFilter, bodyParserException } from './api-error.filter';

export const JSON_BODY_LIMIT = 16 * 1024;

// Create the application with bodyParser: false so this ordering also applies to parser errors.
export function configureHttp(
  app: NestExpressApplication,
  environment: 'development' | 'production',
): void {
  app.setGlobalPrefix('v1');
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Request-Id', randomUUID());
    next();
  });
  app.use(helmet());
  app.useBodyParser('json', { limit: JSON_BODY_LIMIT, strict: true, inflate: false });
  // Preserve typed parser failures before Nest normalizes native SyntaxError instances.
  app.use((error: unknown, _req: Request, _res: Response, next: NextFunction) => {
    next(bodyParserException(error) ?? error);
  });
  app.use((req: Request & { receivedAt?: number }, _res: Response, next: NextFunction) => {
    // A partially uploaded body must not reserve an earlier answer deadline.
    req.receivedAt = Date.now();
    next();
  });
  if (environment === 'development') app.enableCors({ origin: true });
  app.useGlobalFilters(new ApiErrorFilter());
}
