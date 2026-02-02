# Collections Module

Files
- src/collections/collections.module.ts
- src/collections/collections.controller.ts
- src/collections/collections.service.ts
- src/collections/dto/create-collection.dto.ts
- src/collections/dto/update-collection.dto.ts

## Purpose
Organizes fragrances into curated collections.

## CollectionsService
Responsibilities
- Public list of collections.
- Admin CRUD.

## Endpoints
Public
- GET /api/collections

Admin
- GET /api/collections/admin
- POST /api/collections/admin
- PUT /api/collections/admin/:id
- DELETE /api/collections/admin/:id

## DTOs
- `CreateCollectionDto`: name, slug, optional description.
- `UpdateCollectionDto`: partial update of `CreateCollectionDto`.

## Access Control
- Public list is open.
- Admin routes require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.
