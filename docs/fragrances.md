# Fragrances Module

Files
- src/fragrances/fragrances.module.ts
- src/fragrances/fragrances.controller.ts
- src/fragrances/admin-fragrances.controller.ts
- src/fragrances/fragrances.service.ts
- src/fragrances/dto/create-fragrance.dto.ts
- src/fragrances/dto/update-fragrance.dto.ts
- src/fragrances/dto/fragrance-query.dto.ts

## Purpose
Public catalog and admin CRUD for fragrances, plus filterable query support.

## FragrancesService
Responsibilities
- Public listing with filters and pagination.
- Public detail by slug.
- Admin CRUD.

Public filters
- search (name/description)
- collectionId
- noteId
- concentration
- sizeMl
- featured
- minPriceCents / maxPriceCents
- page / limit

## Endpoints
Public
- GET /api/fragrances
- GET /api/fragrances/:slug

Admin
- GET /api/admin/fragrances
- POST /api/admin/fragrances
- PUT /api/admin/fragrances/:id
- DELETE /api/admin/fragrances/:id

## DTOs
- `CreateFragranceDto`: required fields for creation, plus optional notes and flags.
- `UpdateFragranceDto`: partial update of `CreateFragranceDto`.
- `FragranceQueryDto`: optional query params for filtering and pagination.

## Access Control
- Public endpoints are marked with `@Public()`.
- Admin endpoints require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.
