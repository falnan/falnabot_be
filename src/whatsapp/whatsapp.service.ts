import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private VERIFY_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    this.VERIFY_TOKEN =
      this.configService.get<string>('WHATSAPP_VERIFY_TOKEN') || '';
  }

  verifyWebhook(mode: string, token: string): boolean {
    return mode === 'subscribe' && token === this.VERIFY_TOKEN;
  }

  handleIncomingMessage(body: any) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];
      const text = message.text?.body || '';

      this.logger.log(`Pesan diterima: ${text}`);
      return text;
    } catch (error) {
      this.logger.error('Error di Whatsapp Service', error.stack);
      throw new InternalServerErrorException('Gagal memproses pesan');
    }
  }
}
