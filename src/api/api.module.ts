import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  controllers: [ApiController],
  imports: [PrismaModule],
})
export class ApiModule {}
