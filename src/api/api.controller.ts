import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async findManyUser(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '2',
  ) {
    const currentPage = Number(page) || 1;
    const limit = Number(pageSize) || 2;

    const total = await this.prisma.user.count();
    const users = await this.prisma.user.findMany({
      skip: (currentPage - 1) * limit,
      take: limit,
    });
    return {
      currentPage,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      users,
    };
  }

  @Get('conversations')
  async findManyConversations() {
    return this.prisma.conversation.findMany({
      include: { messages: true },
    });
  }
}
