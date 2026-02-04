import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

// Helper for mock auth responses.
const buildAuthResponse = (token = 'mocked.jwt.token') => ({ accessToken: token });

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(() => {
    // Mock AuthService methods used by the controller.
    service = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as AuthService;

    // Create controller with mocked service.
    controller = new AuthController(service);
  });

  it('register() delegates to service', async () => {
    // Arrange
    (service.register as jest.Mock).mockResolvedValue(buildAuthResponse());

    const dto = { email: 'user@marcuscruz.com', password: 'StrongPass123' };

    // Act
    const result = await controller.register(dto);

    // Assert
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual(buildAuthResponse());
  });

  it('login() delegates to service', async () => {
    // Arrange
    (service.login as jest.Mock).mockResolvedValue(buildAuthResponse());

    const dto = { email: 'user@marcuscruz.com', password: 'StrongPass123' };

    // Act
    const result = await controller.login(dto);

    // Assert
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(buildAuthResponse());
  });
});
