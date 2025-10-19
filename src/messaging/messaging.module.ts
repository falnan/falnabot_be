import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingController } from './messaging.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('WHATSAPP_BASE_URL')}/${configService.get('WHATSAPP_PHONE_NUMBER_ID')}`,
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${configService.get('WHATSAPP_TOKEN')}`,
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessagingService],
  controllers: [MessagingController],
})
export class MessagingModule {}
