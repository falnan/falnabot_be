import { Controller, Get } from '@nestjs/common';
import { EventsGateway } from './event.gateway';

@Controller('events')
export class EventsController {
  constructor(private eventGateway: EventsGateway) {}

  @Get('test')
  async test() {
    return await this.eventGateway.emitConversationUpdated(1);
    // return { status: 'Event emitted' };
  }
}
