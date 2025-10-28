import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);
  constructor(private prisma: PrismaService) {}

  @Get('users')
  async findManyUser(@Query() query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const allowedSortFields = ['id', 'createdAt', 'updatedAt'];
    const sortBy = allowedSortFields.includes(query.sortBy)
      ? query.sortBy
      : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    const search = query.search || null;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }

    // const where: any = {
    // ...(filter.status && { status: filter.status }),
    // ...(filter.courier && { courier: filter.courier }),
    // ...(filter.dateRange?.start &&
    //   filter.dateRange?.end && {
    //     createdAt: {
    //       gte: new Date(filter.dateRange.start),
    //       lte: new Date(filter.dateRange.end),
    //     },
    //   }),
    // ...(search && {
    //   OR: [
    //     { name: { contains: search, mode: 'insensitive' } },
    //     { phoneNumber: { contains: search, mode: 'insensitive' } },
    // { resi: { contains: search, mode: 'insensitive' } },
    //     ],
    //   }),
    // };

    //query to DB
    const [data, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      sort: {
        sortBy,
        sortOrder,
      },
      // filter: {
      // status: filter.status || null,
      // courier: filter.courier || null,
      // dateRange: filter.dateRange || null,
      // },
      search: search || null,
    };
  }

  @Get('conversations')
  async findManyConversations() {
    return this.prisma.user.findMany({
      where: { role: 'client' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('conversation/:id')
  async findConversationById(@Param('id') id: string) {
    return this.prisma.user.findUnique({
      where: { id: id },
      include: {
        messages: { orderBy: { createdAt: 'desc' } },
      },
    });
  }
}
