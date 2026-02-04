import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  // Inject the service that contains collections business logic.
  constructor(private readonly collectionsService: CollectionsService) {}

  // GET /api/collections
  // Public list of active collections.
  @Get()
  @Public()
  @ApiOperation({ summary: 'List public collections' })
  @ApiResponse({ status: 200, description: 'Public collection list' })
  listPublic() {
    return this.collectionsService.listPublic();
  }

  // GET /api/collections/admin
  // Admin list of all collections.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'List collections (admin)' })
  @ApiResponse({ status: 200, description: 'Collection list' })
  listAdmin() {
    return this.collectionsService.listAdmin();
  }

  // POST /api/collections/admin
  // Admin creates a collection.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  @ApiOperation({ summary: 'Create collection (admin)' })
  @ApiResponse({ status: 201, description: 'Collection created' })
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  // PUT /api/collections/admin/:id
  // Admin updates a collection by id.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id')
  @ApiOperation({ summary: 'Update collection (admin)' })
  @ApiResponse({ status: 200, description: 'Collection updated' })
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  // DELETE /api/collections/admin/:id
  // Admin deletes a collection by id.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete collection (admin)' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  delete(@Param('id') id: string) {
    return this.collectionsService.delete(id);
  }
}
