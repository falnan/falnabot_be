import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import type { FastifyReply } from 'fastify';
import { OrchestratorService } from 'src/orchestrator/orchestrator.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(
    private readonly webhookService: WebhookService,
    private readonly orchestratorService: OrchestratorService,
  ) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const verified = this.webhookService.verifyWebhook(mode, token, challenge);
    return verified;
  }

  @Post()
  async handleIncomingMessage(@Body() body: any, @Res() res: FastifyReply) {
    this.logger.log('Webhook diterima');
    res.code(HttpStatus.OK).send();
    setImmediate(async () => {
      try {
        await this.orchestratorService.chatbotFlow(body);
      } catch (error) {
        this.logger.error(
          'Masalah pada handleIncomingMessage',
          error?.stack || error,
        );
      }
    });
  }
}
