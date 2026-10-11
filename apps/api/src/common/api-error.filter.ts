import { Catch, HttpException, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { GameRuleError } from '../modules/games/domain/solo';

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiErrorFilter.name);
  catch(error: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    if (error instanceof GameRuleError) {
      response.status(409).json({ code: error.code, message: error.message });
      return;
    }
    if (error instanceof HttpException) {
      const payload = error.getResponse();
      if (typeof payload === 'object' && payload !== null && 'code' in payload) {
        response.status(error.getStatus()).json(payload);
        return;
      }
      response.status(error.getStatus()).json({
        code: error.getStatus() === 429 ? 'rate_limited' : 'request_failed',
        message:
          error.getStatus() === 429
            ? 'Çox sürətli sorğu göndərildi. Bir az gözlə.'
            : 'Sorğunu yerinə yetirmək mümkün olmadı.',
      });
      return;
    }
    // Do not serialize Prisma errors: their messages can contain connection details or SQL values.
    this.logger.error(
      'Request failed',
      error instanceof Error ? error.constructor.name : 'UnknownError',
    );
    response.status(503).json({
      code: 'server_unavailable',
      message: 'Serverlə əlaqədə problem var. Yenidən yoxla.',
    });
  }
}
