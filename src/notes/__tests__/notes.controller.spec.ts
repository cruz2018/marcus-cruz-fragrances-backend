import { NotesController } from '../notes.controller';
import { NotesService } from '../notes.service';

// Helper factory to build fake notes.
const buildNote = (overrides: Partial<any> = {}) => ({
  id: 'note_1',
  name: 'Bergamot',
  slug: 'bergamot',
  ...overrides,
});

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(() => {
    // Mock the service methods used by the controller.
    service = {
      listPublic: jest.fn(),
      listAdmin: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as NotesService;

    // Create controller with mocked service.
    controller = new NotesController(service);
  });

  it('listPublic() delegates to service', async () => {
    // Arrange
    (service.listPublic as jest.Mock).mockResolvedValue([buildNote()]);

    // Act
    const result = await controller.listPublic();

    // Assert
    expect(service.listPublic).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('listAdmin() delegates to service', async () => {
    // Arrange
    (service.listAdmin as jest.Mock).mockResolvedValue([buildNote()]);

    // Act
    const result = await controller.listAdmin();

    // Assert
    expect(service.listAdmin).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('create() delegates to service', async () => {
    // Arrange
    (service.create as jest.Mock).mockResolvedValue(buildNote());

    const dto = { name: 'Bergamot', slug: 'bergamot' };
    // Act
    const result = await controller.create(dto);

    // Assert
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(buildNote());
  });

  it('update() delegates to service', async () => {
    // Arrange
    (service.update as jest.Mock).mockResolvedValue(buildNote({ name: 'Cedar' }));

    const dto = { name: 'Cedar' };
    // Act
    const result = await controller.update('note_1', dto);

    // Assert
    expect(service.update).toHaveBeenCalledWith('note_1', dto);
    expect(result).toEqual(buildNote({ name: 'Cedar' }));
  });

  it('delete() delegates to service', async () => {
    // Arrange
    (service.delete as jest.Mock).mockResolvedValue(buildNote());

    // Act
    const result = await controller.delete('note_1');

    // Assert
    expect(service.delete).toHaveBeenCalledWith('note_1');
    expect(result).toEqual(buildNote());
  });
});
