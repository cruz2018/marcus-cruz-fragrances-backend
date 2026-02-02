import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Noir Collection' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'noir-collection' })
  slug: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Dark, rich, and elegant scents.' })
  description?: string;
}
