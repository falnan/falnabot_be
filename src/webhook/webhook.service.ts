import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly WHATSAPP_VERIFY_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    this.WHATSAPP_VERIFY_TOKEN =
      configService.get<string>('WHATSAPP_VERIFY_TOKEN') || '';
  }

  public verifyWebhook(mode: string, token: string, challenge: string): string {
    if (mode === 'subscribe' && token === this.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    } else {
      this.logger.error('Verifikasi gagal');
      throw new UnauthorizedException('Invalid verify token or mode');
    }
  }
}
