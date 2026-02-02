import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const fragranceIds = dto.items.map((item) => item.fragranceId);
    const fragrances = await this.prisma.fragrance.findMany({
      where: { id: { in: fragranceIds }, isActive: true },
    });

    if (fragrances.length !== fragranceIds.length) {
      throw new BadRequestException('One or more fragrances are invalid');
    }

    const totalCents = dto.items.reduce((sum, item) => {
      const fragrance = fragrances.find((f) => f.id === item.fragranceId);
      return sum + (fragrance?.priceCents ?? 0) * item.quantity;
    }, 0);

    const currency = fragrances[0]?.currency ?? 'USD';

    return this.prisma.order.create({
      data: {
        userId,
        totalCents,
        currency,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => {
            const fragrance = fragrances.find((f) => f.id === item.fragranceId);
            return {
              fragranceId: item.fragranceId,
              quantity: item.quantity,
              unitPriceCents: fragrance?.priceCents ?? 0,
            };
          }),
        },
      },
      include: { items: { include: { fragrance: true } } },
    });
  }

  listMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { fragrance: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  listAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { fragrance: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
