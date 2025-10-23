import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { MessagingModule } from './messaging/messaging.module';
import { ClassificationModule } from './classification/classification.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { PrismaService } from './database/prisma/prisma.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WebhookModule,
    MessagingModule,
    ClassificationModule,
    OrchestratorModule,
    PrismaModule,
    ApiModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
