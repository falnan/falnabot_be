import { Controller, Get } from '@nestjs/common';
import { ClassificationService } from './classification.service';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  public async testing() {
    // const result = this.classificationService.classifyMessage(
    //   'saya ingin bertanya tentang informasi lowonagan kerja',
    // );
    return await this.classificationService.classifyMessage('hehehe');
  }
}
