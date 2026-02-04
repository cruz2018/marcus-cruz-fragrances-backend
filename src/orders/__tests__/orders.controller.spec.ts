import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';

// Helper to build a fake order record.
const buildOrder = (overrides: Partial<any> = {}) => ({
  id: 'order_1',
  userId: 'user_1',
  totalCents: 14500,
  currency: 'USD',
  items: [],
  ...overrides,
});

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(() => {
    // Mock the service methods used by the controller.
    service = {
      createOrder: jest.fn(),
      listMyOrders: jest.fn(),
    } as unknown as OrdersService;

    // Create controller with mocked service.
    controller = new OrdersController(service);
  });

  it('create() delegates to service', async () => {
    // Arrange
    (service.createOrder as jest.Mock).mockResolvedValue(buildOrder());

    const dto = { items: [{ fragranceId: 'frag_1', quantity: 1 }] };
    const user = { sub: 'user_1' };

    // Act
    const result = await controller.create(user, dto);

    // Assert
    expect(service.createOrder).toHaveBeenCalledWith('user_1', dto);
    expect(result).toEqual(buildOrder());
  });

  it('listMine() delegates to service', async () => {
    // Arrange
    (service.listMyOrders as jest.Mock).mockResolvedValue([buildOrder()]);

    const user = { sub: 'user_1' };

    // Act
    const result = await controller.listMine(user);

    // Assert
    expect(service.listMyOrders).toHaveBeenCalledWith('user_1');
    expect(result).toHaveLength(1);
  });
});
