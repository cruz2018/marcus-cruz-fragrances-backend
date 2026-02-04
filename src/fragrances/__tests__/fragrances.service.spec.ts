import { FragrancesService } from '../fragrances.service';
import { PrismaService } from '../../prisma/prisma.service';

// Helper factory to build a fake fragrance record.
const buildFragrance = (overrides: Partial<any> = {}) => ({
  id: 'frag_1',
  name: 'Essence No. 1',
  slug: 'essence-no-1',
  description: 'Citrus opening with amber base.',
  priceCents: 14500,
  currency: 'USD',
  sizeMl: 50,
  concentration: 'EDP',
  isActive: true,
  isFeatured: false,
  collectionId: 'collection_1',
  notes: [],
  ...overrides,
});

describe('FragrancesService', () => {
  let fragrancesService: FragrancesService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Mock Prisma methods used by the service.
    prisma = {
      fragrance: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      fragranceNote: {
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    } as unknown as PrismaService;

    // Create service with mocked Prisma dependency.
    fragrancesService = new FragrancesService(prisma);
  });

  describe('listPublic()', () => {
    it('builds filters and paginates results', async () => {
      // Arrange
      (prisma.fragrance.findMany as jest.Mock).mockResolvedValue([buildFragrance()]);

      // Act
      const result = await fragrancesService.listPublic({
        search: 'amber',
        collectionId: 'collection_1',
        noteId: 'note_1',
        concentration: 'EDP',
        sizeMl: 50,
        featured: 'true',
        minPriceCents: 10000,
        maxPriceCents: 20000,
        page: 2,
        limit: 20,
      });

      // Assert
      expect(prisma.fragrance.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            collectionId: 'collection_1',
            concentration: 'EDP',
            sizeMl: 50,
            isFeatured: true,
            priceCents: { gte: 10000, lte: 20000 },
            notes: { some: { noteId: 'note_1' } },
            OR: [
              { name: { contains: 'amber', mode: 'insensitive' } },
              { description: { contains: 'amber', mode: 'insensitive' } },
            ],
          }),
          orderBy: { createdAt: 'desc' },
          skip: 20,
          take: 20,
        }),
      );
      expect(result).toHaveLength(1);
    });

    it('caps limit at 50', async () => {
      // Arrange
      (prisma.fragrance.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      await fragrancesService.listPublic({ limit: 100 });

      // Assert
      expect(prisma.fragrance.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
          skip: 0,
        }),
      );
    });
  });

  describe('getPublicBySlug()', () => {
    it('looks up an active fragrance by slug', async () => {
      // Arrange
      (prisma.fragrance.findFirst as jest.Mock).mockResolvedValue(buildFragrance());

      // Act
      const result = await fragrancesService.getPublicBySlug('essence-no-1');

      // Assert
      expect(prisma.fragrance.findFirst).toHaveBeenCalledWith({
        where: { slug: 'essence-no-1', isActive: true },
        include: { collection: true, notes: { include: { note: true } } },
      });
      expect(result).toEqual(buildFragrance());
    });
  });

  describe('listAdmin()', () => {
    it('returns all fragrances ordered by createdAt desc', async () => {
      // Arrange
      (prisma.fragrance.findMany as jest.Mock).mockResolvedValue([buildFragrance()]);

      // Act
      const result = await fragrancesService.listAdmin();

      // Assert
      expect(prisma.fragrance.findMany).toHaveBeenCalledWith({
        include: { collection: true, notes: { include: { note: true } } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('create()', () => {
    it('creates a fragrance with notes and defaults', async () => {
      // Arrange
      (prisma.fragrance.create as jest.Mock).mockResolvedValue(buildFragrance());

      // Act
      const result = await fragrancesService.create({
        name: 'Essence No. 1',
        slug: 'essence-no-1',
        description: 'Citrus opening with amber base.',
        priceCents: 14500,
        sizeMl: 50,
        concentration: 'EDP',
        collectionId: 'collection_1',
        notes: [
          { noteId: 'note_1', type: 'TOP' },
          { noteId: 'note_2', type: 'BASE' },
        ],
      });

      // Assert
      expect(prisma.fragrance.create).toHaveBeenCalledWith({
        data: {
          name: 'Essence No. 1',
          slug: 'essence-no-1',
          description: 'Citrus opening with amber base.',
          priceCents: 14500,
          currency: 'USD',
          sizeMl: 50,
          concentration: 'EDP',
          isActive: true,
          isFeatured: false,
          collectionId: 'collection_1',
          notes: {
            create: [
              { noteId: 'note_1', type: 'TOP' },
              { noteId: 'note_2', type: 'BASE' },
            ],
          },
        },
        include: { collection: true, notes: { include: { note: true } } },
      });
      expect(result).toEqual(buildFragrance());
    });
  });

  describe('update()', () => {
    it('replaces notes when notes are provided', async () => {
      // Arrange
      const tx = {
        fragranceNote: { deleteMany: jest.fn() },
        fragrance: { update: jest.fn().mockResolvedValue(buildFragrance()) },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback: any) => callback(tx));

      // Act
      const result = await fragrancesService.update('frag_1', {
        name: 'Updated',
        notes: [
          { noteId: 'note_1', type: 'TOP' },
          { noteId: 'note_2', type: 'BASE' },
        ],
      });

      // Assert
      expect(tx.fragranceNote.deleteMany).toHaveBeenCalledWith({ where: { fragranceId: 'frag_1' } });
      expect(tx.fragrance.update).toHaveBeenCalledWith({
        where: { id: 'frag_1' },
        data: {
          name: 'Updated',
          slug: undefined,
          description: undefined,
          priceCents: undefined,
          currency: undefined,
          sizeMl: undefined,
          concentration: undefined,
          isActive: undefined,
          isFeatured: undefined,
          collectionId: undefined,
          notes: {
            create: [
              { noteId: 'note_1', type: 'TOP' },
              { noteId: 'note_2', type: 'BASE' },
            ],
          },
        },
        include: { collection: true, notes: { include: { note: true } } },
      });
      expect(result).toEqual(buildFragrance());
    });
  });

  describe('delete()', () => {
    it('deletes a fragrance by id', async () => {
      // Arrange
      (prisma.fragrance.delete as jest.Mock).mockResolvedValue(buildFragrance());

      // Act
      const result = await fragrancesService.delete('frag_1');

      // Assert
      expect(prisma.fragrance.delete).toHaveBeenCalledWith({ where: { id: 'frag_1' } });
      expect(result).toEqual(buildFragrance());
    });
  });
});
