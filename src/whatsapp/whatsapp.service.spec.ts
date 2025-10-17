import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { ConfigModule } from '@nestjs/config';

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [WhatsappService],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should log VERIFY_TOKEN', () => {
  //   const result = service.verifyWebhook(
  //     'subscribe',
  //     'my_secret_token',
  //     'challenge',
  //   );
  //   expect(result).toBe(true);
  // });
});
