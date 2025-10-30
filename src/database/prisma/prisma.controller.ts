import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MessageType, User } from 'generated/prisma';
import { faker } from '@faker-js/faker';

@Controller('seed')
export class PrismaController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async seedDatabase() {
    // 🔹 Hapus semua data lama
    await this.prisma.message.deleteMany();
    await this.prisma.conversationParticipant.deleteMany();
    await this.prisma.conversation.deleteMany();
    await this.prisma.user.deleteMany();

    // 🔹 Reset autoincrement ID agar mulai dari 1
    // Ini khusus untuk SQLite
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='User';`,
    );
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='Conversation';`,
    );
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='ConversationParticipant';`,
    );
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name='Message';`,
    );

    // 🔹 Buat 10 user
    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      const user = await this.prisma.user.create({
        data: {
          phoneNumber: faker.phone.number(),
          username: faker.internet.userName(),
          fullName: faker.person.fullName(),
          title: faker.person.jobTitle(),
          profile: faker.image.avatarGitHub(),
        },
      });
      users.push(user);
    }

    // 🔹 Admin = user dengan ID 1 (pasti sekarang)
    const admin = users[0];
    const regularUsers = users.slice(1); // user selain admin

    // 🔹 Buat 1 conversation per user (admin ↔ user)
    for (const user of regularUsers) {
      const conversation = await this.prisma.conversation.create({
        data: {},
      });

      // Tambahkan peserta
      await this.prisma.conversationParticipant.createMany({
        data: [
          { userId: admin.id, conversationId: conversation.id },
          { userId: user.id, conversationId: conversation.id },
        ],
      });

      // Buat pesan acak bolak-balik
      const messageCount = faker.number.int({ min: 6, max: 12 });
      let isAdminTurn = faker.datatype.boolean();

      for (let i = 0; i < messageCount; i++) {
        const senderId = isAdminTurn ? admin.id : user.id;
        await this.prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId,
            message: faker.lorem.sentence(),
            messageClassification: null,
            messageType: MessageType.text,
          },
        });
        isAdminTurn = !isAdminTurn;
      }
    }

    // 🔹 Log hasil
    const counts = {
      users: await this.prisma.user.count(),
      conversations: await this.prisma.conversation.count(),
      participants: await this.prisma.conversationParticipant.count(),
      messages: await this.prisma.message.count(),
    };

    return {
      message: '✅ Seed completed successfully',
      adminId: admin.id,
      counts,
    };
  }
}
