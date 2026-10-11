import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { answerSchema, commandSchema } from '@azquiz/contracts';
import { validate } from '../../../common/validation';
import { AuthGuard } from '../../auth/auth.guard';
import type { AuthenticatedRequest } from '../../auth/auth.guard';
import { SoloService } from '../application/solo.service';
@Controller('games')
@UseGuards(AuthGuard)
export class GamesController {
  constructor(@Inject(SoloService) private readonly solo: SoloService) {}
  @Post('solo') start(@Req() req: AuthenticatedRequest, @Body() body: unknown) {
    return this.solo.start(req.userId, validate(commandSchema, body).commandId);
  }
  @Get('active') async active(@Req() req: AuthenticatedRequest) {
    return { game: await this.solo.active(req.userId) };
  }
  @Get(':id') read(@Req() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.solo.read(req.userId, id);
  }
  @Post(':id/answers') answer(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ) {
    return this.solo.answer(req.userId, id, validate(answerSchema, body), req.receivedAt);
  }
  @Post(':id/leave') leave(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
  ) {
    return this.solo.leave(req.userId, id, validate(commandSchema, body).commandId);
  }
}
