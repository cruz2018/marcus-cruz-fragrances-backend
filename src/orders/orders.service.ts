import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  // PrismaService is the database gateway for orders and fragrances.
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new order for the current user.
   * - Validates that all requested fragrances exist and are active
   * - Calculates totals and line items
   * - Saves the order + items in one create call
   */
  async createOrder(userId: string, dto: CreateOrderDto) {
    // Extract all fragrance ids from the incoming order items.
    const fragranceIds = dto.items.map((item) => item.fragranceId);

    // Load the matching fragrances from the database.
    const fragrances = await this.prisma.fragrance.findMany({
      where: { id: { in: fragranceIds }, isActive: true },
    });

    // If any fragrance is missing or inactive, reject the order.
    if (fragrances.length !== fragranceIds.length) {
      throw new BadRequestException('One or more fragrances are invalid');
    }

    // Sum up the total cost based on item quantity and unit price.
    const totalCents = dto.items.reduce((sum, item) => {
      const fragrance = fragrances.find((f) => f.id === item.fragranceId);
      return sum + (fragrance?.priceCents ?? 0) * item.quantity;
    }, 0);

    // Use the first fragrance currency (default to USD).
    const currency = fragrances[0]?.currency ?? 'USD';

    // Create the order and nested items in one call.
    return this.prisma.order.create({
      data: {
        userId,
        totalCents,
        currency,
        notes: dto.notes,
        items: {
          // Convert each order item into a DB row.
          create: dto.items.map((item) => {
            const fragrance = fragrances.find((f) => f.id === item.fragranceId);
            return {
              fragranceId: item.fragranceId,
              quantity: item.quantity,
              // Store unit price at time of purchase.
              unitPriceCents: fragrance?.priceCents ?? 0,
            };
          }),
        },
      },
      include: { items: { include: { fragrance: true } } },
    });
  }

  /**
   * List orders for a specific user (their order history).
   */
  listMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { fragrance: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin list of all orders in the system.
   */
  listAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { fragrance: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
