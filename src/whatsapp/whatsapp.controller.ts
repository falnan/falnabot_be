import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('webhook')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  public verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    try {
      const verified = this.whatsappService.verifyWebhook(mode, token);
      if (verified) return challenge;
      throw new HttpException('Verification failed', HttpStatus.FORBIDDEN); //belum paham
    } catch (error) {
      this.logger.error('❌ Error terjadi', error.stack);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); //belum paham
    }
  }
}
