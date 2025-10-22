import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Conversation, Message, PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  async findOrCreateByPhone(phone: string) {
    let user = await this.user.findUnique({
      where: { phoneNumber: phone },
    });
    if (!user) {
      user = await this.user.create({
        data: { phoneNumber: phone, name: '', role: 'client' },
      });
    }
    return user;
  }

  async messageIncoming(message: Message) {
    return this.message.create({
      data: message,
    });
  }

  async messageOutgoing(message: Message) {
    return this.message.create({
      data: message,
    });
  }

  async createConversation(adminId: string, clientId: string) {
    return this.conversation.create({
      data: {
        adminId: adminId,
        clientId: clientId,
      },
    });
  }
}
