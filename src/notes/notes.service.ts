import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  // PrismaService is the database gateway for notes.
  constructor(private readonly prisma: PrismaService) {}

  // Public list of notes (alphabetical).
  listPublic() {
    return this.prisma.note.findMany({ orderBy: { name: 'asc' } });
  }

  // Admin list of notes (most recent first).
  listAdmin() {
    return this.prisma.note.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Create a new note (admin).
  create(dto: CreateNoteDto) {
    return this.prisma.note.create({ data: dto });
  }

  // Update a note by id (admin).
  update(id: string, dto: UpdateNoteDto) {
    return this.prisma.note.update({ where: { id }, data: dto });
  }

  // Delete a note by id (admin).
  delete(id: string) {
    return this.prisma.note.delete({ where: { id } });
  }
}
