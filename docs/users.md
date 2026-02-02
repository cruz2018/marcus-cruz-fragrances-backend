# Users Module

Files
- src/users/users.module.ts
- src/users/users.controller.ts
- src/users/users.service.ts

## Purpose
Provides user profile and admin user listing.

## UsersService
Responsibilities
- Fetch user by ID.
- List all users (admin only).

## Endpoints
- GET /api/users/me (auth required)
- GET /api/users/admin (admin only)

## Access Control
- `JwtAuthGuard` protects all user routes.
- `RolesGuard` + `@Roles(Role.ADMIN)` protect admin list.
