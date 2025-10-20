import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { listTemplate } from 'src/infrastructure/templates/list.template';

@Injectable()
export class ClassificationService {
  private readonly logger = new Logger(ClassificationService.name);
  private gemini: any;
  private categories: string[];
  private categoriesString: string;

  constructor() {
    this.gemini = new GoogleGenAI({});
    this.categories = listTemplate.map((item) => item.id);
    this.categories.unshift('salam');
    this.categories.push('lainnya');
    this.categoriesString = this.categories.join(', ');
  }

  public async classifyMessage(message: string) {
    try {
      const response = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
        Kamu adalah sistem klasifikasi pesan.
        Tentukan kategori pesan berikut ke dalam salah satu dari:
        ${this.categoriesString}

        Jawab hanya dengan 1 kategori, tanpa penjelasan.

        Pesan: ${message}
        Contoh jawaban: penelitian
      `,
      });

      return response.text;
    } catch (error) {
      this.logger.error('Error:', error.stack);
    }
  }
}
