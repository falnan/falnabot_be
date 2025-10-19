import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { WhatsappController } from 'src/whatsapp/whatsapp.controller';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  private verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    try {
      // const verified = this.webhookService.verifyWebhook(mode, token);
    } catch (error) {
      this.logger.error('Error terjadi', error.stack);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
