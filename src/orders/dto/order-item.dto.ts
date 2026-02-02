import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  @ApiProperty({ example: 'fragrance_cuid' })
  fragranceId: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 2, minimum: 1 })
  quantity: number;
}
