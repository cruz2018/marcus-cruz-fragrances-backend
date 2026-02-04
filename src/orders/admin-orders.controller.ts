import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin-orders')
@ApiBearerAuth()
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminOrdersController {
  // Inject the service that contains order business logic.
  constructor(private readonly ordersService: OrdersService) {}

  // GET /api/admin/orders
  // Admin-only list of all orders in the system.
  @Get()
  @ApiOperation({ summary: 'List all orders (admin)' })
  @ApiResponse({ status: 200, description: 'Order list' })
  listAll() {
    // Delegate to the service.
    return this.ordersService.listAll();
  }
}
