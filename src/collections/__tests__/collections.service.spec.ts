import { CollectionsService } from '../collections.service';
import { PrismaService } from '../../prisma/prisma.service';

// Helper factory to build fake collections.
const buildCollection = (overrides: Partial<any> = {}) => ({
  id: 'collection_1',
  name: 'Noir Collection',
  slug: 'noir-collection',
  description: 'Dark, rich, and elegant scents.',
  isActive: true,
  ...overrides,
});

describe('CollectionsService', () => {
  let collectionsService: CollectionsService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Mock Prisma methods used by the service.
    prisma = {
      collection: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    // Create service with mocked Prisma dependency.
    collectionsService = new CollectionsService(prisma);
  });

  describe('listPublic()', () => {
    it('returns active collections ordered by name asc', async () => {
      // Arrange
      (prisma.collection.findMany as jest.Mock).mockResolvedValue([buildCollection()]);

      // Act
      const result = await collectionsService.listPublic();

      // Assert
      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('listAdmin()', () => {
    it('returns collections ordered by createdAt desc', async () => {
      // Arrange
      (prisma.collection.findMany as jest.Mock).mockResolvedValue([buildCollection()]);

      // Act
      const result = await collectionsService.listAdmin();

      // Assert
      expect(prisma.collection.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('create()', () => {
    it('creates a collection', async () => {
      // Arrange
      (prisma.collection.create as jest.Mock).mockResolvedValue(buildCollection());

      // Act
      const result = await collectionsService.create({
        name: 'Noir Collection',
        slug: 'noir-collection',
        description: 'Dark, rich, and elegant scents.',
      });

      // Assert
      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          name: 'Noir Collection',
          slug: 'noir-collection',
          description: 'Dark, rich, and elegant scents.',
        },
      });
      expect(result).toEqual(buildCollection());
    });
  });

  describe('update()', () => {
    it('updates a collection by id', async () => {
      // Arrange
      (prisma.collection.update as jest.Mock).mockResolvedValue(buildCollection({ name: 'Noir 2' }));

      // Act
      const result = await collectionsService.update('collection_1', { name: 'Noir 2' });

      // Assert
      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 'collection_1' },
        data: { name: 'Noir 2' },
      });
      expect(result).toEqual(buildCollection({ name: 'Noir 2' }));
    });
  });

  describe('delete()', () => {
    it('deletes a collection by id', async () => {
      // Arrange
      (prisma.collection.delete as jest.Mock).mockResolvedValue(buildCollection());

      // Act
      const result = await collectionsService.delete('collection_1');

      // Assert
      expect(prisma.collection.delete).toHaveBeenCalledWith({ where: { id: 'collection_1' } });
      expect(result).toEqual(buildCollection());
    });
  });
});
