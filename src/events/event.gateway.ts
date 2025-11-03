import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  type WsResponse,
} from '@nestjs/websockets';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/database/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  emitUserUpdated(user: any) {
    this.server.emit('user_updated', user);
  }

  // @SubscribeMessage('events')
  // onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
  //   const event = 'events';
  //   const response = [1, 2, 3];

  //   return from(response).pipe(map((data) => ({ event, data })));
  // }

  @SubscribeMessage('events')
  // handleEvent(@MessageBody() jeje: unknown): WsResponse<unknown> {
  handleEvent(@MessageBody() jeje: unknown, @ConnectedSocket() client: Socket) {
    // const event = 'events';
    // const data = 'coba';
    // return { event, data };
    client.emit('events', { hehe: 'ha', sadf: 'akd' });
  }

  @SubscribeMessage('get_conversations')
  async handleGetConversations(@ConnectedSocket() client: Socket) {
    const adminId = 1; // Admin selalu user dengan ID 1

    // 🔹 Ambil semua conversation yang diikuti oleh admin
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: adminId },
        },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          include: { sender: true },
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // 🔹 Format hasil agar sesuai format chat UI
    const formatted = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p.userId !== adminId,
      )?.user;

      return {
        id: `conv${conv.id}`,
        phoneNumber: otherUser?.phoneNumber,
        profile: otherUser?.profile ?? null,
        username: otherUser?.username ?? null,
        fullName: otherUser?.fullName ?? null,
        title: otherUser?.title ?? null,
        messages: conv.messages.map((msg) => ({
          sender:
            msg.senderId === adminId
              ? 'You'
              : (otherUser?.fullName ?? 'Unknown'),
          message: msg.message ?? '',
          timestamp: msg.timestamp,
        })),
      };
    });

    // 🔹 Kirim balik hasil ke client yang minta
    // client.emit('conversations_data', { conversations: formatted });
    client.emit('get_conversations', { conversations: formatted });
    // client.emit('events', { conversations: formatted });
  }
}
