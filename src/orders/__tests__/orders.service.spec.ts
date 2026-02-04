import { BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { PrismaService } from '../../prisma/prisma.service';

// Helper to build a fake fragrance record.
const buildFragrance = (overrides: Partial<any> = {}) => ({
  id: 'frag_1',
  name: 'Essence No. 1',
  priceCents: 14500,
  currency: 'USD',
  isActive: true,
  ...overrides,
});

// Helper to build a fake order record.
const buildOrder = (overrides: Partial<any> = {}) => ({
  id: 'order_1',
  userId: 'user_1',
  totalCents: 14500,
  currency: 'USD',
  items: [],
  ...overrides,
});

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Mock Prisma methods used by OrdersService.
    prisma = {
      fragrance: {
        findMany: jest.fn(),
      },
      order: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    } as unknown as PrismaService;

    // Create service with mocked Prisma dependency.
    ordersService = new OrdersService(prisma);
  });

  describe('createOrder()', () => {
    it('creates an order and computes totals', async () => {
      // Arrange
      (prisma.fragrance.findMany as jest.Mock).mockResolvedValue([
        buildFragrance({ id: 'frag_1', priceCents: 10000, currency: 'USD' }),
        buildFragrance({ id: 'frag_2', priceCents: 5000, currency: 'USD' }),
      ]);
      (prisma.order.create as jest.Mock).mockResolvedValue(buildOrder());

      const dto = {
        items: [
          { fragranceId: 'frag_1', quantity: 1 },
          { fragranceId: 'frag_2', quantity: 2 },
        ],
        notes: 'Leave at door',
      };

      // Act
      const result = await ordersService.createOrder('user_1', dto);

      // Assert
      expect(prisma.fragrance.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['frag_1', 'frag_2'] }, isActive: true },
      });
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user_1',
          totalCents: 20000,
          currency: 'USD',
          notes: 'Leave at door',
          items: {
            create: [
              { fragranceId: 'frag_1', quantity: 1, unitPriceCents: 10000 },
              { fragranceId: 'frag_2', quantity: 2, unitPriceCents: 5000 },
            ],
          },
        },
        include: { items: { include: { fragrance: true } } },
      });
      expect(result).toEqual(buildOrder());
    });

    it('throws when any fragrance is invalid', async () => {
      // Arrange: only one fragrance returned (one is missing).
      (prisma.fragrance.findMany as jest.Mock).mockResolvedValue([buildFragrance({ id: 'frag_1' })]);

      const dto = {
        items: [
          { fragranceId: 'frag_1', quantity: 1 },
          { fragranceId: 'missing', quantity: 1 },
        ],
      };

      // Act + Assert
      await expect(ordersService.createOrder('user_1', dto)).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('listMyOrders()', () => {
    it('returns orders for a user ordered by createdAt desc', async () => {
      // Arrange
      (prisma.order.findMany as jest.Mock).mockResolvedValue([buildOrder()]);

      // Act
      const result = await ordersService.listMyOrders('user_1');

      // Assert
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        include: { items: { include: { fragrance: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('listAll()', () => {
    it('returns all orders ordered by createdAt desc', async () => {
      // Arrange
      (prisma.order.findMany as jest.Mock).mockResolvedValue([buildOrder()]);

      // Act
      const result = await ordersService.listAll();

      // Assert
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        include: { items: { include: { fragrance: true } }, user: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });
});
