import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

// Helper to build a fake user record.
const buildUser = (overrides: Partial<any> = {}) => ({
  id: 'user_1',
  email: 'user@marcuscruz.com',
  firstName: 'Marcus',
  lastName: 'Cruz',
  role: 'USER',
  isActive: true,
  ...overrides,
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(() => {
    // Mock UsersService methods used by the controller.
    service = {
      findById: jest.fn(),
      listAll: jest.fn(),
    } as unknown as UsersService;

    // Create controller with mocked service.
    controller = new UsersController(service);
  });

  it('me() delegates to service', async () => {
    // Arrange
    (service.findById as jest.Mock).mockResolvedValue(buildUser());

    const user = { sub: 'user_1' };

    // Act
    const result = await controller.me(user);

    // Assert
    expect(service.findById).toHaveBeenCalledWith('user_1');
    expect(result).toEqual(buildUser());
  });

  it('listAll() delegates to service', async () => {
    // Arrange
    (service.listAll as jest.Mock).mockResolvedValue([buildUser()]);

    // Act
    const result = await controller.listAll();

    // Assert
    expect(service.listAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});
