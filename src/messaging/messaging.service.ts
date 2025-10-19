import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

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

  //   TODO:
  //   -buatkan logika send dengan AI
  public async sendAIMessage(sender: string, message: string): Promise<any> {
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
      this.logger.error('Error di sendAIMessage:', error.stack);
    }
  }

  //   TODO
  // -perbaiki rows agar sesuai automatis sesuai template
  public async sendUnknowMessage(
    sender: string,
    message: string,
  ): Promise<any> {
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
                  rows: [
                    {
                      id: 'penelitian',
                      title: 'Izin Penelitian',
                      description: 'Ajukan izin penelitian di BP3MI Riau.',
                    },
                    {
                      id: 'permintaan_data',
                      title: 'Akses Data Resmi',
                      description: 'Permintaan data resmi BP3MI Riau.',
                    },
                    {
                      id: 'perizinan_magang',
                      title: 'Izin Magang',
                      description: 'Ajukan izin magang di BP3MI Riau.',
                    },
                    {
                      id: 'permohonan_kerja_sama',
                      title: 'Kerja Sama',
                      description: 'Ajukan kerja sama kelembagaan.',
                    },
                    {
                      id: 'inf_lowongan_kejr',
                      title: 'Info Lowongan',
                      description: 'Lihat daftar lowongan luar negeri resmi.',
                    },
                    {
                      id: 'info_p3mi_riau',
                      title: 'Daftar P3MI Riau',
                      description: 'Lihat perusahaan penempatan resmi di Riau.',
                    },
                    {
                      id: 'kendala_siskop2mi',
                      title: 'Kendala SISKOP2MI',
                      description: 'Laporkan kendala aplikasi SISKOP2MI.',
                    },
                  ],
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
