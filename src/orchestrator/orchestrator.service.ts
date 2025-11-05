import { Injectable, Logger } from '@nestjs/common';
import { ClassificationService } from 'src/classification/classification.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { UserSessionService } from './user-session/user-session.service';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { dataAITemplate } from 'src/infrastructure/templates/data-ai.template';
import { EventsGateway } from 'src/events/event.gateway';
import { listTemplate } from 'src/infrastructure/templates/list.template';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);
  constructor(
    private prisma: PrismaService,
    private readonly messagingService: MessagingService,
    private readonly classificationService: ClassificationService,
    private readonly userSessionService: UserSessionService,
    private websocketServer: EventsGateway,
  ) {}

  public async chatbotFlow(body: any) {
    const rawText = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!rawText) return;
    const sender: string = rawText?.from || '';
    const message: string = rawText?.text?.body || '';
    const messageType: string = rawText?.type || '';
    const messageCategory: string =
      await this.classificationService.classifyMessage(message);
    const messageCategoryByList: string =
      rawText?.interactive?.list_reply?.id ||
      rawText?.interactive?.button_reply?.id ||
      '';

    const isNewOrExpired = this.userSessionService.isNewOrExpired(sender);
    this.userSessionService.updateSession(sender);

    // find or create new user to db
    const { senderId, conversationId } =
      await this.prisma.findOrCreateNewUserByPhone(sender);

    if (messageType == 'text') {
      await this.prisma.insertDbIncomingMessage(
        message,
        conversationId,
        senderId,
        'text',
        messageCategory,
      );
    } else if (messageType == 'interactive') {
      await this.prisma.insertDbIncomingMessage(
        message,
        conversationId,
        senderId,
        'text',
        messageCategoryByList,
      );
    }

    // send greeting if new or session expired
    if (isNewOrExpired) {
      await this.prisma.insertDbOutgoingMessage(
        `👋 Hai. Saya *Zapin AI*, asisten digital yang siap membantu Anda mendapatkan informasi  seputar layanan BP3MI. Anda dapat bertanya langsung, misalnya: 

💬_Bagaimana cara bekerja ke luar negeri?_

Atau, Anda juga dapat mengakses layanan resmi melalui menu di bawah ini.`,
        conversationId,
        'interactive',
      );
      await this.messagingService.sendGreeting(sender);
    }

    // handle message by type
    if (messageType == 'text') {
      await this.messageTypeText(sender, messageCategory, conversationId);
    } else if (messageType == 'interactive') {
      const matchedTemplate = listTemplate.find(
        (item) =>
          item.id.toLowerCase().trim() ==
          messageCategoryByList.toLowerCase().trim(),
      );

      if (matchedTemplate) {
        await this.prisma.insertDbOutgoingMessage(
          matchedTemplate.answer,
          conversationId,
          'text',
        );
      }
      await this.websocketServer.emitConversationUpdated(conversationId);
      return await this.messagingService.sendMessageByListTemplate(
        sender,
        messageCategoryByList,
      );
    } else {
      await this.prisma.insertDbOutgoingMessage(
        `🙏 Mohon maaf, saat ini *Zapin AI* belum dapat memberikan jawaban akurat atas pertanyaan Anda. Silakan pilih layanan resmi BP3MI Riau yang sesuai di bawah ini.`,
        conversationId,
        'interactive',
      );
      await this.websocketServer.emitConversationUpdated(conversationId);
      return this.messagingService.sendUnknowMessage(sender);
    }
  }

  public async messageTypeText(
    sender: string,
    messageCategory: string,
    conversationId: number,
  ) {
    if (messageCategory == 'salam') {
      this.logger.log('masuk salam');
      await this.websocketServer.emitConversationUpdated(conversationId);
      return;
    } else if (messageCategory == 'lainnya') {
      this.logger.log('masuk lainnya');
      await this.prisma.insertDbOutgoingMessage(
        `🙏 Mohon maaf, saat ini *Zapin AI* belum dapat memberikan jawaban akurat atas pertanyaan Anda. Silakan pilih layanan resmi BP3MI Riau yang sesuai di bawah ini.`,
        conversationId,
        'interactive',
      );
      await this.websocketServer.emitConversationUpdated(conversationId);
      return this.messagingService.sendUnknowMessage(sender);
    } else {
      this.logger.log('masuk template');

      const matchedTemplate = dataAITemplate.find(
        (item) =>
          item.questionCategory.toLowerCase().trim() ==
          messageCategory.toLowerCase().trim(),
      );
      if (matchedTemplate) {
        await this.prisma.insertDbOutgoingMessage(
          matchedTemplate.answer,
          conversationId,
          'text',
        );
      }
      await this.websocketServer.emitConversationUpdated(conversationId);
      return this.messagingService.sendMessageByDataAITemplate(
        sender,
        messageCategory,
      );
    }
  }
}
