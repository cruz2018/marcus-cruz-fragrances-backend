import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Bergamot' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'bergamot' })
  slug: string;
}
