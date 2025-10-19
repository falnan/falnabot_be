import { Controller, Get, Logger } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  private readonly logger = new Logger(MessagingController.name);
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  public testing() {
    const result = this.messagingService.sendManualMessage(
      '+6282285567722',
      'hai',
    );
    this.logger.log('berhasil');
    return result;
  }
}
