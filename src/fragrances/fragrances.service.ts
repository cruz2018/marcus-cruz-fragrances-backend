import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { FragranceQueryDto } from './dto/fragrance-query.dto';

@Injectable()
export class FragrancesService {
  // PrismaService is the database gateway used by this service.
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Public catalog listing with filters + pagination.
   * This only returns active (public) fragrances.
   */
  listPublic(query: FragranceQueryDto) {
    // Build a dynamic Prisma where clause based on query params.
    const where: Record<string, any> = {
      isActive: true,
    };

    // Free-text search across name + description.
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Filter by collection.
    if (query.collectionId) {
      where.collectionId = query.collectionId;
    }

    // Filter by concentration (e.g., EDT/EDP).
    if (query.concentration) {
      where.concentration = query.concentration;
    }

    // Filter by bottle size in mL.
    if (query.sizeMl) {
      where.sizeMl = query.sizeMl;
    }

    // Filter for featured items.
    if (query.featured) {
      where.isFeatured = query.featured === 'true';
    }

    // Filter by note (joins the many-to-many relation).
    if (query.noteId) {
      where.notes = { some: { noteId: query.noteId } };
    }

    // Filter by price range.
    if (query.minPriceCents || query.maxPriceCents) {
      where.priceCents = {
        gte: query.minPriceCents,
        lte: query.maxPriceCents,
      };
    }

    // Pagination defaults + safety cap.
    const limit = Math.min(query.limit ?? 12, 50);
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    // Query with related collection + notes for richer responses.
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

  /**
   * Public detail lookup by slug (only active items).
   */
  getPublicBySlug(slug: string) {
    return this.prisma.fragrance.findFirst({
      where: { slug, isActive: true },
      include: { collection: true, notes: { include: { note: true } } },
    });
  }

  /**
   * Admin list returns all items (active or inactive).
   */
  listAdmin() {
    return this.prisma.fragrance.findMany({
      include: { collection: true, notes: { include: { note: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin create with optional note links.
   */
  async create(dto: CreateFragranceDto) {
    return this.prisma.fragrance.create({
      data: {
        // Core fields
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
        // Many-to-many notes: create join records if provided.
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

  /**
   * Admin update. If notes are provided, replace the note links.
   */
  async update(id: string, dto: UpdateFragranceDto) {
    // Transaction ensures delete + update happen atomically.
    return this.prisma.$transaction(async (tx) => {
      // If notes are provided, wipe existing join rows before recreating.
      if (dto.notes) {
        await tx.fragranceNote.deleteMany({ where: { fragranceId: id } });
      }

      return tx.fragrance.update({
        where: { id },
        data: {
          // Only provided fields get updated (undefined is ignored by Prisma).
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
          // Recreate note links if provided.
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

  /**
   * Admin delete by id.
   */
  delete(id: string) {
    return this.prisma.fragrance.delete({ where: { id } });
  }
}
