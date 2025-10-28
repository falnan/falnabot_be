import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Conversation, MessageType, Role, User } from 'generated/prisma';
import { faker } from '@faker-js/faker';

@Controller('prisma')
export class PrismaController {
  constructor(private prisma: PrismaService) {}

  @Get('seed')
  async seedDatabase() {
    console.log('🌱 Start seeding...');

    // 🧩 1️⃣ Create Admin User
    const admin = await this.prisma.user.create({
      data: {
        phoneNumber: faker.phone.number(),
        name: faker.person.fullName(),
        role: Role.admin,
      },
    });

    // 🧩 2️⃣ Create 20 Client Users
    const clients: User[] = [];
    for (let i = 0; i < 20; i++) {
      const client = await this.prisma.user.create({
        data: {
          phoneNumber: faker.phone.number(),
          name: faker.person.fullName(),
          role: Role.client,
        },
      });
      clients.push(client);
    }

    // 🧩 3️⃣ Create 20 Conversations (each between admin & one client)
    const conversations: Conversation[] = [];
    for (const client of clients) {
      const convo = await this.prisma.conversation.create({
        data: {
          adminId: admin.id,
          clientId: client.id,
        },
      });
      conversations.push(convo);
    }

    // 🧩 4️⃣ Create 50 Messages (randomly assigned)
    for (let i = 0; i < 50; i++) {
      const convo = faker.helpers.arrayElement(conversations);
      const sender = faker.helpers.arrayElement([
        admin,
        faker.helpers.arrayElement(clients),
      ]);

      await this.prisma.message.create({
        data: {
          userId: sender.id,
          conversationId: convo.id,
          message: faker.lorem.sentence(),
          messageClassification: faker.helpers.arrayElement([
            'general',
            'question',
            'complaint',
          ]),
          messageType: faker.helpers.arrayElement(Object.values(MessageType)),
        },
      });
    }

    console.log('✅ Seeding completed.');
    return { message: '✅ Database seeded successfully' };
  }
}
