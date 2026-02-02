import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FragrancesService } from './fragrances.service';
import { FragranceQueryDto } from './dto/fragrance-query.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('fragrances')
@Controller('fragrances')
export class FragrancesController {
  constructor(private readonly fragrancesService: FragrancesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List public fragrances' })
  @ApiResponse({ status: 200, description: 'Public fragrance list' })
  list(@Query() query: FragranceQueryDto) {
    return this.fragrancesService.listPublic(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get fragrance by slug' })
  @ApiResponse({ status: 200, description: 'Fragrance detail' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getBySlug(@Param('slug') slug: string) {
    return this.fragrancesService.getPublicBySlug(slug);
  }
}
