import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { dataAITemplate } from 'src/infrastructure/templates/data-ai.template';

@Injectable()
export class ClassificationService {
  private readonly logger = new Logger(ClassificationService.name);
  private gemini: any;
  private categories: string[];
  private categoriesString: string;

  constructor() {
    this.gemini = new GoogleGenAI({});
    this.categories = dataAITemplate.map((item) => item.questionCategory);
    this.categories.unshift('salam');
    this.categories.push('lainnya');
    this.categoriesString = this.categories.join(', ');
  }

  public async classifyMessage(message: string) {
    try {
      const response = await this.gemini.models.generateContent({
        // model: 'gemini-2.5-flash',
        model: 'gemini-2.5-flash-lite',
        contents: `
        Kamu adalah sistem klasifikasi pesan.
        Tentukan kategori pertanyaan pesan berikut ke dalam salah satu dari:
        ${this.categoriesString}

        Jawab hanya dengan 1 kategori, tanpa penjelasan.

        Pesan: ${message}
        Contoh jawaban: lainnya
      `,
      });
      //TODO Tambahkan logika validasi jawaban, jika tidak cocok, return lainnya
      return response.text;
    } catch (error) {
      this.logger.error('Error:', error.stack);
    }
  }
}
