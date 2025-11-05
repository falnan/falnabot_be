import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { OrchestratorController } from './orchestrator.controller';
import { MessagingModule } from 'src/messaging/messaging.module';
import { ClassificationModule } from 'src/classification/classification.module';
import { UserSessionService } from './user-session/user-session.service';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [OrchestratorService, UserSessionService],
  controllers: [OrchestratorController],
  imports: [MessagingModule, ClassificationModule, PrismaModule, EventsModule],
  exports: [OrchestratorService],
})
export class OrchestratorModule {}
