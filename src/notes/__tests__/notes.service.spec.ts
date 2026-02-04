import { NotesService } from '../notes.service';
import { PrismaService } from '../../prisma/prisma.service';

// Helper factory to create a fake note record (like Prisma returns).
const buildNote = (overrides: Partial<any> = {}) => ({
  id: 'note_1',
  name: 'Bergamot',
  slug: 'bergamot',
  ...overrides,
});

describe('NotesService', () => {
  let notesService: NotesService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Mock Prisma methods used by NotesService.
    prisma = {
      note: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    // Create the service with the mocked Prisma dependency.
    notesService = new NotesService(prisma);
  });

  describe('listPublic()', () => {
    it('returns notes ordered by name asc', async () => {
      // Arrange: Prisma returns one note.
      (prisma.note.findMany as jest.Mock).mockResolvedValue([buildNote()]);

      // Act
      const result = await notesService.listPublic();

      // Assert
      expect(prisma.note.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('listAdmin()', () => {
    it('returns notes ordered by createdAt desc', async () => {
      // Arrange
      (prisma.note.findMany as jest.Mock).mockResolvedValue([buildNote()]);

      // Act
      const result = await notesService.listAdmin();

      // Assert
      expect(prisma.note.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('create()', () => {
    it('creates a note', async () => {
      // Arrange
      (prisma.note.create as jest.Mock).mockResolvedValue(buildNote());

      // Act
      const result = await notesService.create({ name: 'Bergamot', slug: 'bergamot' });

      // Assert
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: { name: 'Bergamot', slug: 'bergamot' },
      });
      expect(result).toEqual(buildNote());
    });
  });

  describe('update()', () => {
    it('updates a note by id', async () => {
      // Arrange
      (prisma.note.update as jest.Mock).mockResolvedValue(buildNote({ name: 'Cedar' }));

      // Act
      const result = await notesService.update('note_1', { name: 'Cedar' });

      // Assert
      expect(prisma.note.update).toHaveBeenCalledWith({
        where: { id: 'note_1' },
        data: { name: 'Cedar' },
      });
      expect(result).toEqual(buildNote({ name: 'Cedar' }));
    });
  });

  describe('delete()', () => {
    it('deletes a note by id', async () => {
      // Arrange
      (prisma.note.delete as jest.Mock).mockResolvedValue(buildNote());

      // Act
      const result = await notesService.delete('note_1');

      // Assert
      expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 'note_1' } });
      expect(result).toEqual(buildNote());
    });
  });
});
