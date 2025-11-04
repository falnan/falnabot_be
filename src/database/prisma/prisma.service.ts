import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Conversation, Message, Prisma, PrismaClient } from 'generated/prisma';

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

    let conversation: any;
    let conversationParticipant: any;

    //if user doesn't exist, create new user, conversation, and conversation participant
    if (!user) {
      user = await this.user.create({
        data: { phoneNumber: sender, username: '', fullName: '' },
      });
      conversation = await this.conversation.create({ data: {} });
      await this.conversationParticipant.createMany({
        data: [
          { conversationId: conversation.id, userId: user.id },
          { conversationId: conversation.id, userId: 1 }, // 1 is the admin
        ],
      });
    } else {
      //if user exists, find conversation
      conversationParticipant = await this.conversationParticipant.findFirst({
        where: { userId: user.id },
      });
    }

    return {
      senderId: user.id,
      conversationId: conversation
        ? conversation.id
        : conversationParticipant.conversationId,
    };
  }

  async insertDbOutgoingMessage(
    message: string,
    conversationId: number,
    messageType: 'text' | 'interactive',
  ) {
    await this.message.create({
      data: {
        conversationId,
        senderId: 1, // 1 is the admin
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
