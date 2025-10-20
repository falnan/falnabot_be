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
    const categoryByList: string =
      rawText?.interactive?.list_reply?.id ||
      rawText?.interactive?.button_reply?.id ||
      '';

    const isNew = this.userSessionService.isNewOrExpired(sender);

    if (isNew) {
      await this.messagingService.sendGreeting(sender);
    }
    this.userSessionService.updateSession(sender);

    //TODO lanjutkan logika kodingan ini
    if (messageType == 'text') {
      const messageCategory: string =
        await this.classificationService.classifyMessage(message);

      return await this.messagingService.sendMessageByTemplate(
        sender,
        messageCategory,
      );
    } else if (messageType == 'interactive') {
      await this.messagingService.sendMessageByTemplate(sender, categoryByList);
    } else return;
  }
}
