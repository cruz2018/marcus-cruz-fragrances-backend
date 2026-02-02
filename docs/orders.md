# Orders Module

Files
- src/orders/orders.module.ts
- src/orders/orders.controller.ts
- src/orders/admin-orders.controller.ts
- src/orders/orders.service.ts
- src/orders/dto/create-order.dto.ts
- src/orders/dto/order-item.dto.ts

## Purpose
Handles customer orders and admin order visibility.

## OrdersService
Responsibilities
- Create order for a user.
- List orders for current user.
- List all orders for admin.

## Endpoints
Authenticated
- POST /api/orders
- GET /api/orders/me

Admin
- GET /api/admin/orders

## DTOs
- `CreateOrderDto`: array of order items + optional notes.
- `OrderItemDto`: fragranceId + quantity.

## Access Control
- All order routes require `JwtAuthGuard`.
- Admin list requires `RolesGuard` with `Role.ADMIN`.
