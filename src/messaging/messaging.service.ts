import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { dataAITemplate } from 'src/infrastructure/templates/data-ai.template';
import { listTemplate } from 'src/infrastructure/templates/list.template';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  constructor(private readonly httpService: HttpService) {}

  public async sendManualMessage(
    sender: string,
    message: string,
  ): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post('/messages', {
          messaging_product: 'whatsapp',
          to: sender,
          text: { body: message },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error di sendManualMessage:', error.stack);
    }
  }

  public async sendMessageByTemplate(
    sender: string,
    message_category: string,
  ): Promise<any> {
    try {
      const matchedTemplate = dataAITemplate.find(
        (item) =>
          item.question_kategory.toLowerCase() ==
          message_category.toLowerCase(),
      );

      if (!matchedTemplate) {
        // FIXME perbaiki bagian 'maaflah' jika klasifikasi tidak cocok
        await this.sendManualMessage(sender, 'maaflah');
        return;
      }
      const result = await this.sendManualMessage(
        sender,
        matchedTemplate.answer,
      );
      return result;
    } catch (error) {
      this.logger.error('Error di sendAIMessage:', error.stack);
    }
  }

  public async sendUnknowMessage(sender: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post('/messages', {
          messaging_product: 'whatsapp',
          to: sender,
          type: 'interactive',
          interactive: {
            type: 'list',
            body: {
              text: `🙏 Mohon maaf, saat ini *Zapin AI* belum dapat memberikan jawaban akurat atas pertanyaan Anda. Silakan pilih layanan resmi BP3MI Riau yang sesuai di bawah ini.`,
            },
            footer: {
              text: 'Zapin AI - Asisten Digital BP3MI Riau',
            },
            action: {
              button: 'Lihat Layanan',
              sections: [
                {
                  title: 'Layanan Utama',
                  rows: listTemplate,
                },
              ],
            },
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error di sendUnknowMessage:', error.stack);
    }
  }
  public async sendGreeting(sender: string): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.post('/messages', {
          messaging_product: 'whatsapp',
          to: sender,
          type: 'interactive',
          interactive: {
            type: 'list',
            body: {
              text: `👋 Hai. Saya *Zapin AI*, asisten digital yang siap membantu Anda mendapatkan informasi  seputar layanan BP3MI. Anda dapat bertanya langsung, misalnya: 

💬_Bagaimana cara mengajukan izin penelitian?_

Atau, Anda juga dapat mengakses layanan resmi melalui menu di bawah ini.`,
            },
            footer: {
              text: 'Zapin AI - Asisten Digital BP3MI Riau',
            },
            action: {
              button: 'Lihat Layanan',
              sections: [
                {
                  title: 'Layanan Utama',
                  rows: listTemplate,
                },
              ],
            },
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error di sendUnknowMessage:', error.stack);
    }
  }
}
