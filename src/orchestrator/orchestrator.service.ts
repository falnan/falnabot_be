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
    const messageCategoryByList: string =
      rawText?.interactive?.list_reply?.id ||
      rawText?.interactive?.button_reply?.id ||
      '';

    this.logger.log(sender);

    const isNewOrExpired = this.userSessionService.isNewOrExpired(sender);
    this.userSessionService.updateSession(sender);

    const messageCategory: string =
      await this.classificationService.classifyMessage(message);

    this.logger.log(message, messageCategory);

    if (isNewOrExpired) {
      await this.messagingService.sendGreeting(sender);
    }

    if (messageType == 'text') {
      await this.messageTypeText(sender, messageCategory);
    } else if (messageType == 'interactive') {
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
