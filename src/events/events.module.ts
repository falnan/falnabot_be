import { Module } from '@nestjs/common';
import { EventsGateway } from './event.gateway';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  providers: [EventsGateway],
  imports: [PrismaModule],
  exports: [EventsGateway],
})
export class EventsModule {}
