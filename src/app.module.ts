import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { MessagingModule } from './messaging/messaging.module';
import { ClassificationModule } from './classification/classification.module';
import { OrchestratorModule } from './orchestrator/orchestrator.module';
import { PrismaService } from './database/prisma/prisma.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { EventsModule } from './events/events.module';
import { InsertDbModule } from './database/insert-db/insert-db.module';
import { OutgoingMessageModule } from './outgoing-message/outgoing-message.module';
import { OutgoingMessageModule } from './database/outgoing-message/outgoing-message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WebhookModule,
    MessagingModule,
    ClassificationModule,
    OrchestratorModule,
    PrismaModule,
    ApiModule,
    EventsModule,
    InsertDbModule,
    OutgoingMessageModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
