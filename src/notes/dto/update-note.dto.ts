import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

// DTO for updating a note (all fields optional).
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
