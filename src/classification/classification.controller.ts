import { Controller, Get } from '@nestjs/common';
import { ClassificationService } from './classification.service';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  public testing() {
    const result = this.classificationService.classifyMessage('yes');
    return result;
  }
}
