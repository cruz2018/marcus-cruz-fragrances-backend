import { CollectionsController } from '../collections.controller';
import { CollectionsService } from '../collections.service';

// Helper factory to build fake collections.
const buildCollection = (overrides: Partial<any> = {}) => ({
  id: 'collection_1',
  name: 'Noir Collection',
  slug: 'noir-collection',
  description: 'Dark, rich, and elegant scents.',
  isActive: true,
  ...overrides,
});

describe('CollectionsController', () => {
  let controller: CollectionsController;
  let service: CollectionsService;

  beforeEach(() => {
    // Mock the service methods used by the controller.
    service = {
      listPublic: jest.fn(),
      listAdmin: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as CollectionsService;

    // Create controller with mocked service.
    controller = new CollectionsController(service);
  });

  it('listPublic() delegates to service', async () => {
    // Arrange
    (service.listPublic as jest.Mock).mockResolvedValue([buildCollection()]);

    // Act
    const result = await controller.listPublic();

    // Assert
    expect(service.listPublic).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('listAdmin() delegates to service', async () => {
    // Arrange
    (service.listAdmin as jest.Mock).mockResolvedValue([buildCollection()]);

    // Act
    const result = await controller.listAdmin();

    // Assert
    expect(service.listAdmin).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('create() delegates to service', async () => {
    // Arrange
    (service.create as jest.Mock).mockResolvedValue(buildCollection());

    const dto = {
      name: 'Noir Collection',
      slug: 'noir-collection',
      description: 'Dark, rich, and elegant scents.',
    };
    // Act
    const result = await controller.create(dto);

    // Assert
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(buildCollection());
  });

  it('update() delegates to service', async () => {
    // Arrange
    (service.update as jest.Mock).mockResolvedValue(buildCollection({ name: 'Noir 2' }));

    const dto = { name: 'Noir 2' };
    // Act
    const result = await controller.update('collection_1', dto);

    // Assert
    expect(service.update).toHaveBeenCalledWith('collection_1', dto);
    expect(result).toEqual(buildCollection({ name: 'Noir 2' }));
  });

  it('delete() delegates to service', async () => {
    // Arrange
    (service.delete as jest.Mock).mockResolvedValue(buildCollection());

    // Act
    const result = await controller.delete('collection_1');

    // Assert
    expect(service.delete).toHaveBeenCalledWith('collection_1');
    expect(result).toEqual(buildCollection());
  });
});
