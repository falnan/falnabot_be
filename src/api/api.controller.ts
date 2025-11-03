import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { EventsGateway } from 'src/events/event.gateway';

@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);

  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  // @Get('users')
  // async findManyUser(@Query() query: any) {
  //   const page = Number(query.page) || 1;
  //   const limit = Number(query.limit) || 10;
  //   const allowedSortFields = ['id', 'createdAt', 'updatedAt'];
  //   const sortBy = allowedSortFields.includes(query.sortBy)
  //     ? query.sortBy
  //     : 'createdAt';
  //   const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
  //   const search = query.search || null;

  //   const skip = (page - 1) * limit;

  //   const where: any = {};

  //   if (search) {
  //     where.OR = [
  //       { name: { contains: search } },
  //       { phoneNumber: { contains: search } },
  //     ];
  //   }

  //   //query to DB
  //   const [data, totalItems] = await Promise.all([
  //     this.prisma.user.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //       orderBy: { [sortBy]: sortOrder },
  //       select: {
  //         id: true,
  //         phoneNumber: true,
  //         username: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     }),
  //     this.prisma.user.count({ where }),
  //   ]);

  //   const totalPages = Math.ceil(totalItems / limit);

  //   return {
  //     data,
  //     meta: {
  //       page,
  //       limit,
  //       totalItems,
  //       totalPages,
  //       hasNextPage: page < totalPages,
  //       hasPrevPage: page > 1,
  //     },
  //     sort: {
  //       sortBy,
  //       sortOrder,
  //     },
  //     search: search || null,
  //   };
  // }

  @Get('users')
  async findManyUsers() {
    return await this.prisma.user.findMany({
      include: { messages: true },
    });
  }

  @Get('messages')
  async findManyMessages() {
    return await this.prisma.message.findMany();
  }

  @Get('conversations')
  async getConversations() {
    const adminId = 1; // admin selalu user dengan ID 1

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

    // 🔹 Format hasil agar sesuai format chat UI kamu
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

    return { conversations: formatted };
  }

  @Put(':id')
  async updateFullName(
    @Param('id') id: string,
    @Body('fullName') fullName: string,
  ) {
    const userId = Number(id);

    console.log(id, fullName);
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 🔹 Update hanya field fullName
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { fullName },
    });

    // 🔹 Trigger event ke semua client WebSocket
    this.eventsGateway.emitUserUpdated({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
    });

    return {
      message: '✅ User fullName updated successfully',
      user: updatedUser,
    };
  }
}
