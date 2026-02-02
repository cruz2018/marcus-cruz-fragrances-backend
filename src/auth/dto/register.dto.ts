import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'lux@marcuscruz.com' })
  email: string;

  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'StrongPass123' })
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: 'Marcus' })
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ example: 'Cruz' })
  lastName?: string;
}
