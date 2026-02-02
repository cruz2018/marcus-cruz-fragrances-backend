import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NoteType } from '@prisma/client';

class FragranceNoteInputDto {
  @IsString()
  @ApiProperty({ example: 'note_cuid' })
  noteId: string;

  @IsNotEmpty()
  @ApiProperty({ enum: NoteType, example: NoteType.TOP })
  type: NoteType;
}

export class CreateFragranceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Essence No. 1' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'essence-no-1' })
  slug: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Citrus opening with amber base.' })
  description?: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 14500 })
  priceCents: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 50 })
  sizeMl: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'EDP' })
  concentration: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'collection_cuid' })
  collectionId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FragranceNoteInputDto)
  @ApiPropertyOptional({ type: [FragranceNoteInputDto] })
  notes?: FragranceNoteInputDto[];
}
