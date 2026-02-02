import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { FragranceQueryDto } from './dto/fragrance-query.dto';

@Injectable()
export class FragrancesService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic(query: FragranceQueryDto) {
    const where: Record<string, any> = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.collectionId) {
      where.collectionId = query.collectionId;
    }

    if (query.concentration) {
      where.concentration = query.concentration;
    }

    if (query.sizeMl) {
      where.sizeMl = query.sizeMl;
    }

    if (query.featured) {
      where.isFeatured = query.featured === 'true';
    }

    if (query.noteId) {
      where.notes = { some: { noteId: query.noteId } };
    }

    if (query.minPriceCents || query.maxPriceCents) {
      where.priceCents = {
        gte: query.minPriceCents,
        lte: query.maxPriceCents,
      };
    }

    const limit = Math.min(query.limit ?? 12, 50);
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    return this.prisma.fragrance.findMany({
      where,
      include: {
        collection: true,
        notes: { include: { note: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  getPublicBySlug(slug: string) {
    return this.prisma.fragrance.findFirst({
      where: { slug, isActive: true },
      include: { collection: true, notes: { include: { note: true } } },
    });
  }

  listAdmin() {
    return this.prisma.fragrance.findMany({
      include: { collection: true, notes: { include: { note: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateFragranceDto) {
    return this.prisma.fragrance.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        priceCents: dto.priceCents,
        currency: dto.currency ?? 'USD',
        sizeMl: dto.sizeMl,
        concentration: dto.concentration,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        collectionId: dto.collectionId,
        notes: dto.notes
          ? {
              create: dto.notes.map((note) => ({
                noteId: note.noteId,
                type: note.type,
              })),
            }
          : undefined,
      },
      include: { collection: true, notes: { include: { note: true } } },
    });
  }

  async update(id: string, dto: UpdateFragranceDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.notes) {
        await tx.fragranceNote.deleteMany({ where: { fragranceId: id } });
      }

      return tx.fragrance.update({
        where: { id },
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          priceCents: dto.priceCents,
          currency: dto.currency,
          sizeMl: dto.sizeMl,
          concentration: dto.concentration,
          isActive: dto.isActive,
          isFeatured: dto.isFeatured,
          collectionId: dto.collectionId,
          notes: dto.notes
            ? {
                create: dto.notes.map((note) => ({
                  noteId: note.noteId,
                  type: note.type,
                })),
              }
            : undefined,
        },
        include: { collection: true, notes: { include: { note: true } } },
      });
    });
  }

  delete(id: string) {
    return this.prisma.fragrance.delete({ where: { id } });
  }
}
