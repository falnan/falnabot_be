import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private VERIFY_TOKEN: string;

  constructor(private readonly configService: ConfigService) {}

  public verifyWebhook() {}
}
