import { AdminFragrancesController } from '../admin-fragrances.controller';
import { FragrancesService } from '../fragrances.service';

// Helper to build a fake fragrance record.
const buildFragrance = (overrides: Partial<any> = {}) => ({
  id: 'frag_1',
  name: 'Essence No. 1',
  slug: 'essence-no-1',
  ...overrides,
});

describe('AdminFragrancesController', () => {
  let controller: AdminFragrancesController;
  let service: FragrancesService;

  beforeEach(() => {
    // Mock service methods used by the controller.
    service = {
      listAdmin: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as FragrancesService;

    // Create controller with mocked service.
    controller = new AdminFragrancesController(service);
  });

  it('list() delegates to service', async () => {
    // Arrange
    (service.listAdmin as jest.Mock).mockResolvedValue([buildFragrance()]);

    // Act
    const result = await controller.list();

    // Assert
    expect(service.listAdmin).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('create() delegates to service', async () => {
    // Arrange
    (service.create as jest.Mock).mockResolvedValue(buildFragrance());

    const dto = { name: 'Essence No. 1', slug: 'essence-no-1' };

    // Act
    const result = await controller.create(dto);

    // Assert
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(buildFragrance());
  });

  it('update() delegates to service', async () => {
    // Arrange
    (service.update as jest.Mock).mockResolvedValue(buildFragrance({ name: 'Updated' }));

    const dto = { name: 'Updated' };

    // Act
    const result = await controller.update('frag_1', dto);

    // Assert
    expect(service.update).toHaveBeenCalledWith('frag_1', dto);
    expect(result).toEqual(buildFragrance({ name: 'Updated' }));
  });

  it('delete() delegates to service', async () => {
    // Arrange
    (service.delete as jest.Mock).mockResolvedValue(buildFragrance());

    // Act
    const result = await controller.delete('frag_1');

    // Assert
    expect(service.delete).toHaveBeenCalledWith('frag_1');
    expect(result).toEqual(buildFragrance());
  });
});
