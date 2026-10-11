import { BadRequestException } from '@nestjs/common';
import type { z } from 'zod';

export function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success)
    throw new BadRequestException({
      code: 'invalid_request',
      message: 'Göndərilən məlumat düzgün deyil.',
    });
  return parsed.data;
}
