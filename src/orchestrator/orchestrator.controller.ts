import { Controller, Get, Logger } from '@nestjs/common';
import { UserSessionService } from './user-session/user-session.service';

@Controller('orchestrator')
export class OrchestratorController {
  private readonly logger = new Logger(OrchestratorController.name);
  constructor(private readonly userSessionService: UserSessionService) {}

  @Get()
  public testing() {
    const hehe = this.userSessionService.isNewOrExpired('123');
    this.userSessionService.updateSession('123');
  }
}
