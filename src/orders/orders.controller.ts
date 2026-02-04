import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  // Inject the service that contains order business logic.
  constructor(private readonly ordersService: OrdersService) {}

  // POST /api/orders
  // Create a new order for the current user.
  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    // Delegate creation logic to the service.
    return this.ordersService.createOrder(user.sub, dto);
  }

  // GET /api/orders/me
  // List orders for the current user.
  @Get('me')
  @ApiOperation({ summary: 'List my orders' })
  @ApiResponse({ status: 200, description: 'Order list' })
  listMine(@CurrentUser() user: JwtPayload) {
    // Delegate lookup logic to the service.
    return this.ordersService.listMyOrders(user.sub);
  }
}
