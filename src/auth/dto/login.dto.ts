import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'lux@marcuscruz.com' })
  email: string;

  @MinLength(8)
  @ApiProperty({ minLength: 8, example: 'StrongPass123' })
  password: string;
}
