import { Injectable, Logger } from '@nestjs/common';
import { ClassificationService } from 'src/classification/classification.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { UserSessionService } from './user-session/user-session.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);
  constructor(
    private prisma: PrismaService,
    private readonly messagingService: MessagingService,
    private readonly classificationService: ClassificationService,
    private readonly userSessionService: UserSessionService,
  ) {}

  public async chatbotFlow(body: any) {
    const rawText = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!rawText) return;
    const sender: string = rawText?.from || '';
    const message: string = rawText?.text?.body || '';
    const messageType: string = rawText?.type || '';

    const isNewOrExpired = this.userSessionService.isNewOrExpired(sender);
    this.userSessionService.updateSession(sender);

    // find or create new user to db
    const { senderId, conversationId } =
      await this.prisma.findOrCreateNewUserByPhone(sender);

    // send greeting if new or session expired
    if (isNewOrExpired) {
      await this.messagingService.sendGreeting(sender);
    }

    // handle message by type
    if (messageType == 'text') {
      const messageCategory: string =
        await this.classificationService.classifyMessage(message);
      await this.prisma.insertDbIncomingMessage(
        message,
        conversationId,
        senderId,
        'text',
        messageCategory,
      );
      //TODO process outgoing message as well
      await this.messageTypeText(sender, messageCategory);
    } else if (messageType == 'interactive') {
      const messageCategoryByList: string =
        rawText?.interactive?.list_reply?.id ||
        rawText?.interactive?.button_reply?.id ||
        '';
      await this.prisma.insertDbIncomingMessage(
        message,
        conversationId,
        senderId,
        'interactive',
        messageCategoryByList,
      );
      //TODO process outgoing message as well
      return await this.messagingService.sendMessageByListTemplate(
        sender,
        messageCategoryByList,
      );
    } else {
      return this.messagingService.sendUnknowMessage(sender);
    }
  }

  public async messageTypeText(sender: string, messageCategory: string) {
    if (messageCategory == 'salam') {
      this.logger.log('masuk salam');
      return;
    } else if (messageCategory == 'lainnya') {
      this.logger.log('masuk lainnya');
      return this.messagingService.sendUnknowMessage(sender);
    } else {
      this.logger.log('masuk template');
      return this.messagingService.sendMessageByDataAITemplate(
        sender,
        messageCategory,
      );
    }
  }
}
