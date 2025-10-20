import { Injectable, Logger } from '@nestjs/common';
import { ClassificationService } from 'src/classification/classification.service';
import { MessagingService } from 'src/messaging/messaging.service';
import { UserSessionService } from './user-session/user-session.service';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);
  constructor(
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

    const isNewOrExpired = this.userSessionService.isNewOrExpired(sender);
    this.userSessionService.updateSession(sender);

    const messageCategory: string =
      await this.classificationService.classifyMessage(message);

    if (isNewOrExpired) {
      await this.messagingService.sendGreeting(sender);
    }

    if (messageType == 'text') {
      await this.messageTypeText(sender, messageCategory);
    } else if (messageType == 'interactive') {
      return await this.messagingService.sendMessageByTemplate(
        sender,
        messageCategoryByList,
      );
    } else {
      return this.messagingService.sendUnknowMessage(sender);
    }
  }

  public async messageTypeText(sender: string, messageCategory: string) {
    if (messageCategory == 'salam') {
      return;
    } else if (messageCategory == 'lainnya') {
      return this.messagingService.sendUnknowMessage(sender);
    } else {
      return this.messagingService.sendMessageByTemplate(
        sender,
        messageCategory,
      );
    }
  }
}
