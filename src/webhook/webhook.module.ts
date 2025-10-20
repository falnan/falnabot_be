import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { OrchestratorService } from 'src/orchestrator/orchestrator.service';
import { OrchestratorModule } from 'src/orchestrator/orchestrator.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [OrchestratorModule],
})
export class WebhookModule {}
