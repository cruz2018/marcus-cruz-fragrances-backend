import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic() {
    return this.prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  listAdmin() {
    return this.prisma.collection.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(dto: CreateCollectionDto) {
    return this.prisma.collection.create({ data: dto });
  }

  update(id: string, dto: UpdateCollectionDto) {
    return this.prisma.collection.update({ where: { id }, data: dto });
  }

  delete(id: string) {
    return this.prisma.collection.delete({ where: { id } });
  }
}
