import { Module } from '@nestjs/common';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { MessagingModule } from './messaging/messaging.module';
import { ClassificationModule } from './classification/classification.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // WhatsappModule,
    // WebhookModule,
    PrismaModule,
    MessagingModule,
    ClassificationModule,
    OrchestratorModule,
  ],
})
export class AppModule {}
