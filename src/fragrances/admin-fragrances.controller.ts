import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FragrancesService } from './fragrances.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';

@ApiTags('admin-fragrances')
@ApiBearerAuth()
@Controller('admin/fragrances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminFragrancesController {
  constructor(private readonly fragrancesService: FragrancesService) {}

  @Get()
  @ApiOperation({ summary: 'List fragrances (admin)' })
  @ApiResponse({ status: 200, description: 'Fragrance list' })
  list() {
    return this.fragrancesService.listAdmin();
  }

  @Post()
  @ApiOperation({ summary: 'Create fragrance (admin)' })
  @ApiResponse({ status: 201, description: 'Fragrance created' })
  create(@Body() dto: CreateFragranceDto) {
    return this.fragrancesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fragrance (admin)' })
  @ApiResponse({ status: 200, description: 'Fragrance updated' })
  update(@Param('id') id: string, @Body() dto: UpdateFragranceDto) {
    return this.fragrancesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fragrance (admin)' })
  @ApiResponse({ status: 200, description: 'Fragrance deleted' })
  delete(@Param('id') id: string) {
    return this.fragrancesService.delete(id);
  }
}
