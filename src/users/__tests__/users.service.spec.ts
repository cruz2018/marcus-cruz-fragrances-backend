import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';

// Helper to build a fake user record
const buildUser = (overrides: Partial<any> = {}) => ({
  id: 'user_1',
  email: 'user@marcuscruz.com',
  firstName: 'Marcus',
  lastName: 'Cruz',
  role: 'USER',
  isActive: true,
  ...overrides,
});

describe('UsersService', () => {
  let usersService: UsersService;
  let prisma: PrismaService;

  beforeEach(() => {
    // Mock Prisma methods used by UsersService.
    prisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as unknown as PrismaService;

    // Create service with mocked Prisma dependency.
    usersService = new UsersService(prisma);
  });

  describe('findById()', () => {
    it('returns a user when found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(buildUser());

      // Act
      const result = await usersService.findById('user_1');

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });
      expect(result).toEqual(buildUser());
    });

    it('returns null when user not found', async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await usersService.findById('missing');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('listAll()', () => {
    it('returns users ordered by createdAt desc', async () => {
      // Arrange
      (prisma.user.findMany as jest.Mock).mockResolvedValue([buildUser(), buildUser({ id: 'user_2' })]);

      // Act
      const result = await usersService.listAll();

      // Assert
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });
  });
});
