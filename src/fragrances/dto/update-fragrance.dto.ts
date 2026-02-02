import { PartialType } from '@nestjs/swagger';
import { CreateFragranceDto } from './create-fragrance.dto';

export class UpdateFragranceDto extends PartialType(CreateFragranceDto) {}
