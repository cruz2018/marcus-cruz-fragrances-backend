import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for public list query params (filters + pagination).
export class FragranceQueryDto {
  // Free-text search across name/description.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'amber' })
  search?: string;

  // Filter by collection id.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'collection_cuid' })
  collectionId?: string;

  // Filter by note id.
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'note_cuid' })
  noteId?: string;

  // Filter by concentration (e.g., EDP, EDT).
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'EDP' })
  concentration?: string;

  // Minimum price in cents.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 10000 })
  minPriceCents?: number;

  // Maximum price in cents.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 20000 })
  maxPriceCents?: number;

  // Filter by bottle size (mL).
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 50 })
  sizeMl?: number;

  // Filter featured items (query string "true" or "false").
  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ example: 'true' })
  featured?: string;

  // Page number for pagination (1-based).
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  // Items per page for pagination.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 12 })
  limit?: number;
}
