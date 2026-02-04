import { AdminOrdersController } from '../admin-orders.controller';
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

describe('AdminOrdersController', () => {
  let controller: AdminOrdersController;
  let service: OrdersService;

  beforeEach(() => {
    // Mock the service method used by the controller.
    service = {
      listAll: jest.fn(),
    } as unknown as OrdersService;

    // Create controller with mocked service.
    controller = new AdminOrdersController(service);
  });

  it('listAll() delegates to service', async () => {
    // Arrange
    (service.listAll as jest.Mock).mockResolvedValue([buildOrder()]);

    // Act
    const result = await controller.listAll();

    // Assert
    expect(service.listAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});
