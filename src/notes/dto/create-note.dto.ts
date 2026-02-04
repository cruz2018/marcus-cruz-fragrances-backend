import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// DTO for creating a note (validates request body).
export class CreateNoteDto {
  // Human-readable note name.
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bergamot' })
  name: string;

  // URL-friendly identifier.
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'bergamot' })
  slug: string;
}
