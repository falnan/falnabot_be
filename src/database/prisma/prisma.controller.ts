import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async testing() {
    return this.prisma.user.findMany();
  }

  @Get('seed')
  async seedData() {
    // 🌱 1. Buat Admin
    const admin = await this.prisma.user.create({
      data: {
        name: 'Admin Utama',
        phoneNumber: '0811111111',
        role: 'admin',
      },
    });

    // 🌱 2. Buat Client
    const client1 = await this.prisma.user.create({
      data: {
        name: 'Client A',
        phoneNumber: '0822222222',
        role: 'client',
      },
    });

    const client2 = await this.prisma.user.create({
      data: {
        name: 'Client B',
        phoneNumber: '0833333333',
        role: 'client',
      },
    });

    // 🌱 3. Buat Conversation antara Admin & Client 1
    const conversation1 = await this.prisma.conversation.create({
      data: {
        adminId: admin.id,
        clientId: client1.id,
      },
    });

    // 🌱 4. Buat Conversation antara Admin & Client 2
    const conversation2 = await this.prisma.conversation.create({
      data: {
        adminId: admin.id,
        clientId: client2.id,
      },
    });

    // 🌱 5. Tambahkan beberapa pesan ke conversation1
    await this.prisma.message.createMany({
      data: [
        {
          userId: client1.id,
          conversationId: conversation1.id,
          message: 'Halo Admin, saya ingin bertanya tentang produk.',
          messageClassification: 'Question',
          messageType: 'text',
        },
        {
          userId: admin.id,
          conversationId: conversation1.id,
          message: 'Halo! Tentu, pertanyaan apa yang bisa saya bantu?',
          messageClassification: 'Response',
          messageType: 'text',
        },
      ],
    });

    // 🌱 6. Tambahkan beberapa pesan ke conversation2
    await this.prisma.message.createMany({
      data: [
        {
          userId: client2.id,
          conversationId: conversation2.id,
          message: 'Apakah ada promo bulan ini?',
          messageClassification: 'Question',
          messageType: 'text',
        },
        {
          userId: admin.id,
          conversationId: conversation2.id,
          message: 'Ya! Promo 20% berlaku sampai akhir bulan.',
          messageClassification: 'Response',
          messageType: 'text',
        },
      ],
    });

    return {
      message: '✅ Seeding berhasil!',
      admin,
      clients: [client1, client2],
      conversations: [conversation1, conversation2],
    };
  }
}
