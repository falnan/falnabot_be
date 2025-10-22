import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Message, Prisma, PrismaClient } from 'generated/prisma';

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

  async messageOutgoing(message: Prisma.MessageCreateInput) {
    return this.message.create({
      data: message,
    });
  }

  async createConversation(conversation: Prisma.ConversationCreateInput) {
    return this.conversation.create({
      data: conversation,
    });
  }
}
