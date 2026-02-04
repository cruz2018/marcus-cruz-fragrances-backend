# Users Module

Files
- src/users/users.module.ts
- src/users/users.controller.ts
- src/users/users.service.ts

## Purpose
Provides user profile and admin user listing.

## Overview (Confluence‑style)
**Audience:** Backend developers, QA

**Responsibilities:**
- Provide authenticated access to the current user profile.
- Provide admin listing of users.
- Ensure sensitive fields (password hash) are never returned.

**Key Decisions:**
- Use Prisma `select` to return only safe fields.
- Protect admin routes with JWT + role guard.

## UsersService
Responsibilities
- Fetch user by ID.
- List all users (admin only).

### Method: `findById(id)`
**Input:** `id: string`

**Behavior:**
- Queries the database by user ID.
- Returns only safe fields (`id`, `email`, `firstName`, `lastName`, `role`, `isActive`).

**Why:**
- Prevents leaking sensitive data such as `passwordHash`.

### Method: `listAll()`
**Behavior:**
- Returns all users in descending creation order.
- Returns only safe fields.

**Why:**
- Admin needs a current list of users for review and support.

## Endpoints
- GET /api/users/me (auth required)
- GET /api/users/admin (admin only)

## Access Control
- `JwtAuthGuard` protects all user routes.
- `RolesGuard` + `@Roles(Role.ADMIN)` protect admin list.

## Data Returned
Fields returned by both endpoints:
- `id`
- `email`
- `firstName`
- `lastName`
- `role`
- `isActive`
