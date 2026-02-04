import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NoteType } from '@prisma/client';

// Nested DTO used when attaching notes to a fragrance.
class FragranceNoteInputDto {
  @IsString()
  @ApiProperty({ example: 'note_cuid' })
  noteId: string;

  @IsNotEmpty()
  @ApiProperty({ enum: NoteType, example: NoteType.TOP })
  type: NoteType;
}

// DTO for creating a fragrance (validates request body).
export class CreateFragranceDto {
  // Display name of the fragrance.
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Essence No. 1' })
  name: string;

  // URL-friendly identifier used in routes.
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'essence-no-1' })
  slug: string;

  // Optional description shown in the catalog.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Citrus opening with amber base.' })
  description?: string;

  // Price stored as integer cents to avoid floating-point errors.
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 14500 })
  priceCents: number;

  // Optional currency code (defaults in service if not provided).
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  // Bottle size in milliliters.
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 50 })
  sizeMl: number;

  // Concentration label (e.g., EDP, EDT).
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'EDP' })
  concentration: string;

  // Whether the fragrance is visible in the public catalog.
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  // Whether the fragrance is featured on the homepage.
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isFeatured?: boolean;

  // Optional collection link (grouping).
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'collection_cuid' })
  collectionId?: string;

  // Optional list of notes to attach (top/middle/base).
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FragranceNoteInputDto)
  @ApiPropertyOptional({ type: [FragranceNoteInputDto] })
  notes?: FragranceNoteInputDto[];
}
