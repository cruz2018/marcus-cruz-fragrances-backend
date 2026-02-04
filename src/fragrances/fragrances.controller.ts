import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FragrancesService } from './fragrances.service';
import { FragranceQueryDto } from './dto/fragrance-query.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('fragrances')
@Controller('fragrances')
export class FragrancesController {
  // Inject the service that contains the business logic.
  constructor(private readonly fragrancesService: FragrancesService) {}

  // GET /api/fragrances
  // Public catalog list with optional filters + pagination.
  @Get()
  @Public()
  @ApiOperation({ summary: 'List public fragrances' })
  @ApiResponse({ status: 200, description: 'Public fragrance list' })
  list(@Query() query: FragranceQueryDto) {
    // Delegate filtering + pagination to the service.
    return this.fragrancesService.listPublic(query);
  }

  // GET /api/fragrances/:slug
  // Public detail endpoint by slug.
  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get fragrance by slug' })
  @ApiResponse({ status: 200, description: 'Fragrance detail' })
  @ApiResponse({ status: 404, description: 'Not found' })
  getBySlug(@Param('slug') slug: string) {
    // Delegate lookup to the service (returns null if not found).
    return this.fragrancesService.getPublicBySlug(slug);
  }
}
