import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClassificationService {
  private readonly logger = new Logger(ClassificationService.name);
  private gemini: any;

  constructor() {
    this.gemini = new GoogleGenAI({});
  }

  public async classifyMessage(message: string) {
    try {
      const response = await this.gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'katakan A',
      });

      // TODO:
      // -cocokkan hasil response dengan template klasifikasi pesan
      // -ubah return dengan valunya adalah hasil dari pencocokan response dan template

      return response.text;
    } catch (error) {
      this.logger.error('Error:', error.stack);
    }
  }
}
