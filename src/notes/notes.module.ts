import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  // NotesService provides the business logic for notes.
  providers: [NotesService],
  // NotesController exposes the HTTP routes.
  controllers: [NotesController],
})
export class NotesModule {}
