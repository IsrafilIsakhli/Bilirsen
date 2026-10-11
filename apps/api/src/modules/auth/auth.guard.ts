import { Inject, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
export type AuthenticatedRequest = Request & { userId: string; receivedAt: number };
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.userId = await this.auth.authenticate(request.headers.authorization);
    return true;
  }
}
