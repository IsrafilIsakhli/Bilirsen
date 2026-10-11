import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { refreshSchema } from '@azquiz/contracts';
import { validate } from '../../common/validation';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}
  @Post('guest')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  guest() {
    return this.auth.guest();
  }
  @Post('refresh')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  refresh(@Body() body: unknown) {
    return this.auth.refresh(validate(refreshSchema, body).refreshToken);
  }
}
