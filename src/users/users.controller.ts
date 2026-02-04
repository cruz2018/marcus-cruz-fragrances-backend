import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import type { JwtPayload } from '../common/types/jwt-payload';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('admin')
  @ApiOperation({ summary: 'List all users (admin)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  listAll() {
    return this.usersService.listAll();
  }
}
