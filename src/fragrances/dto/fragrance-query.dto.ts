import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FragranceQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'amber' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'collection_cuid' })
  collectionId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'note_cuid' })
  noteId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'EDP' })
  concentration?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 10000 })
  minPriceCents?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 20000 })
  maxPriceCents?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 50 })
  sizeMl?: number;

  @IsOptional()
  @IsBooleanString()
  @ApiPropertyOptional({ example: 'true' })
  featured?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 12 })
  limit?: number;
}
