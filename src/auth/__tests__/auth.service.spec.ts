// Unit tests for AuthService using mocked Prisma + JwtService.
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { RegisterDto } from '../dto/register.dto';
import type { LoginDto } from '../dto/login.dto';

// Mock bcrypt so we can control hash/compare results in unit tests.
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

// Helper to build a fake user record (as Prisma would return).
const buildUser = (overrides: Partial<any> = {}) => ({
  id: 'user_1',
  email: 'user@marcuscruz.com',
  passwordHash: 'hashed',
  role: 'USER',
  isActive: true,
  ...overrides,
});

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(() => {
    // Create light‑weight mocks for Prisma and JwtService.
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as PrismaService;

    jwtService = {
      sign: jest.fn(() => 'mocked.jwt.token'),
    } as unknown as JwtService;

    authService = new AuthService(prisma, jwtService);
  });

  describe('register()', () => {
    it('creates a new user and returns a token', async () => {
      // Arrange: email not used, bcrypt returns a hash.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(buildUser());

      const dto: RegisterDto = {
        email: 'user@marcuscruz.com',
        password: 'StrongPass123',
      };

      // Act
      const result = await authService.register(dto);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'mocked.jwt.token' });
    });

    it('throws ConflictException when email already exists', async () => {
      // Arrange: user already exists.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(buildUser());

      const dto: RegisterDto = {
        email: 'user@marcuscruz.com',
        password: 'StrongPass123',
      };

      // Act + Assert
      await expect(authService.register(dto)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('login()', () => {
    it('returns a token when credentials are valid', async () => {
      // Arrange: user exists and bcrypt.compare returns true.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(buildUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const dto: LoginDto = {
        email: 'user@marcuscruz.com',
        password: 'StrongPass123',
      };

      // Act
      const result = await authService.login(dto);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, 'hashed');
      expect(result).toEqual({ accessToken: 'mocked.jwt.token' });
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      // Arrange: user not found.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const dto: LoginDto = {
        email: 'user@marcuscruz.com',
        password: 'StrongPass123',
      };

      // Act + Assert
      await expect(authService.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      // Arrange: user exists but password is wrong.
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(buildUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const dto: LoginDto = {
        email: 'user@marcuscruz.com',
        password: 'StrongPass123',
      };

      // Act + Assert
      await expect(authService.login(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
