import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Message, Prisma, PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  async findOrCreateNewUserByPhone(sender: string) {
    let user = await this.user.findUnique({
      where: { phoneNumber: sender },
    });

    //if no user, create new user, conversation, and conversation participant
    if (!user) {
      const user = await this.user.create({
        data: { phoneNumber: sender, username: '', fullName: '' },
      });
      const conversation = await this.conversation.create({ data: {} });
      await this.conversationParticipant.create({
        data: { conversationId: conversation.id, userId: user.id },
      });
    }
    //TODO lanjutkan ini
    return { data: { senderId: user?.id, conversationId: conversation.id } };
  }

  async insertDbOutgoingMessage(
    message: string,
    conversationId: number,
    senderId: number,
    messageType: 'text' | 'interactive',
  ) {
    await this.message.create({
      data: {
        conversationId,
        senderId,
        message,
        messageType,
      },
    });
  }

  async insertDbIncomingMessage(
    message: string,
    conversationId: number,
    senderId: number,
    messageType: 'text' | 'interactive',
    messageClassification: string,
  ) {
    await this.message.create({
      data: {
        conversationId,
        senderId,
        message,
        messageType,
        messageClassification,
      },
    });
  }
}
