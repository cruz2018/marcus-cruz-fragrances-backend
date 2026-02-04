import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  // Inject service that contains notes business logic.
  constructor(private readonly notesService: NotesService) {}

  // GET /api/notes
  // Public list of notes for filtering and composition.
  @Get()
  @Public()
  @ApiOperation({ summary: 'List public notes' })
  @ApiResponse({ status: 200, description: 'Public note list' })
  listPublic() {
    return this.notesService.listPublic();
  }

  // GET /api/notes/admin
  // Admin list of notes (includes all records).
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'List notes (admin)' })
  @ApiResponse({ status: 200, description: 'Note list' })
  listAdmin() {
    return this.notesService.listAdmin();
  }

  // POST /api/notes/admin
  // Admin creates a note.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  @ApiOperation({ summary: 'Create note (admin)' })
  @ApiResponse({ status: 201, description: 'Note created' })
  create(@Body() dto: CreateNoteDto) {
    return this.notesService.create(dto);
  }

  // PUT /api/notes/admin/:id
  // Admin updates a note by id.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('admin/:id')
  @ApiOperation({ summary: 'Update note (admin)' })
  @ApiResponse({ status: 200, description: 'Note updated' })
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  // DELETE /api/notes/admin/:id
  // Admin deletes a note by id.
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete note (admin)' })
  @ApiResponse({ status: 200, description: 'Note deleted' })
  delete(@Param('id') id: string) {
    return this.notesService.delete(id);
  }
}
