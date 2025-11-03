import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  controllers: [ApiController],
  imports: [PrismaModule, EventsModule],
})
export class ApiModule {}
