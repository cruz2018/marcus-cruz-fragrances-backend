import { FragrancesController } from '../fragrances.controller';
import { FragrancesService } from '../fragrances.service';

// Helper to build a fake fragrance record.
const buildFragrance = (overrides: Partial<any> = {}) => ({
  id: 'frag_1',
  name: 'Essence No. 1',
  slug: 'essence-no-1',
  ...overrides,
});

describe('FragrancesController', () => {
  let controller: FragrancesController;
  let service: FragrancesService;

  beforeEach(() => {
    // Mock service methods used by the controller.
    service = {
      listPublic: jest.fn(),
      getPublicBySlug: jest.fn(),
    } as unknown as FragrancesService;

    // Create controller with mocked service.
    controller = new FragrancesController(service);
  });

  it('list() delegates to service', async () => {
    // Arrange
    (service.listPublic as jest.Mock).mockResolvedValue([buildFragrance()]);

    const query = { search: 'amber', page: 1, limit: 12 };

    // Act
    const result = await controller.list(query);

    // Assert
    expect(service.listPublic).toHaveBeenCalledWith(query);
    expect(result).toHaveLength(1);
  });

  it('getBySlug() delegates to service', async () => {
    // Arrange
    (service.getPublicBySlug as jest.Mock).mockResolvedValue(buildFragrance());

    // Act
    const result = await controller.getBySlug('essence-no-1');

    // Assert
    expect(service.getPublicBySlug).toHaveBeenCalledWith('essence-no-1');
    expect(result).toEqual(buildFragrance());
  });
});
