import { Module } from '@nestjs/common';
import { EventsGateway } from './event.gateway';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { EventsController } from './events.controller';

@Module({
  providers: [EventsGateway],
  imports: [PrismaModule],
  exports: [EventsGateway],
  controllers: [EventsController],
})
export class EventsModule {}
