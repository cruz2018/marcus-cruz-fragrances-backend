import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  // PrismaService is the database client; it lets us query the User table.
  constructor(private readonly prisma: PrismaService) {}

  // Returns a single user by ID (used for the /users/me endpoint).
  // We use `select` to return only safe fields (never the password hash).
  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });
  }

  // Returns all users (admin endpoint).
  // Ordered by newest first for easy admin review.
  listAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
