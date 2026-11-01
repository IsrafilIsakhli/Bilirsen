import { Catch, HttpException, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { GameRuleError } from '../modules/games/domain/solo';

const bodyErrors: Readonly<Record<string, { status: number; code: string; message: string }>> = {
  'entity.parse.failed': {
    status: 400,
    code: 'invalid_json',
    message: 'Göndərilən JSON məlumatı düzgün deyil.',
  },
  'entity.too.large': {
    status: 413,
    code: 'payload_too_large',
    message: 'Göndərilən məlumatın ölçüsü çox böyükdür.',
  },
  'encoding.unsupported': {
    status: 415,
    code: 'unsupported_encoding',
    message: 'Sorğunun kodlaşdırılması dəstəklənmir.',
  },
  'charset.unsupported': {
    status: 415,
    code: 'unsupported_encoding',
    message: 'Sorğunun kodlaşdırılması dəstəklənmir.',
  },
  'request.aborted': {
    status: 400,
    code: 'incomplete_request',
    message: 'Sorğu tam göndərilməyib.',
  },
};

export function bodyParserException(error: unknown): HttpException | undefined {
  if (typeof error !== 'object' || error === null || !('type' in error)) return;
  const definition =
    typeof error.type === 'string' && Object.hasOwn(bodyErrors, error.type)
      ? bodyErrors[error.type]
      : undefined;
  if (definition)
    return new HttpException(
      { code: definition.code, message: definition.message },
      definition.status,
    );
}

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
    this.logger.error({
      event: 'request_failed',
      requestId: response.getHeader('X-Request-Id'),
      errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
    });
    response.status(503).json({
      code: 'server_unavailable',
      message: 'Serverlə əlaqədə problem var. Yenidən yoxla.',
    });
  }
}
