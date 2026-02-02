import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic() {
    return this.prisma.note.findMany({ orderBy: { name: 'asc' } });
  }

  listAdmin() {
    return this.prisma.note.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(dto: CreateNoteDto) {
    return this.prisma.note.create({ data: dto });
  }

  update(id: string, dto: UpdateNoteDto) {
    return this.prisma.note.update({ where: { id }, data: dto });
  }

  delete(id: string) {
    return this.prisma.note.delete({ where: { id } });
  }
}
