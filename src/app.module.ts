import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { MessagingModule } from './messaging/messaging.module';
import { ClassificationModule } from './classification/classification.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WebhookModule,
    PrismaModule,
    MessagingModule,
    ClassificationModule,
    OrchestratorModule,
  ],
})
export class AppModule {}
