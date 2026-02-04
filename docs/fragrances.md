# Fragrances Module

## Overview
The Fragrances module powers the public catalog and the admin CRUD tools. It also supports search and filter queries.

## Key Files
- src/fragrances/fragrances.module.ts
- src/fragrances/fragrances.controller.ts
- src/fragrances/admin-fragrances.controller.ts
- src/fragrances/fragrances.service.ts
- src/fragrances/dto/create-fragrance.dto.ts
- src/fragrances/dto/update-fragrance.dto.ts
- src/fragrances/dto/fragrance-query.dto.ts

## Key Files Explained (What Each One Does)
### src/fragrances/fragrances.module.ts
**Purpose:** Wires the Fragrances feature into NestJS.
- Registers controllers and providers for this module.
- Lets NestJS know how to create and inject `FragrancesService`.

### src/fragrances/fragrances.controller.ts
**Purpose:** Public API routes for the catalog.
- Handles GET /api/fragrances (list with filters).
- Handles GET /api/fragrances/:slug (detail page).
- Calls `FragrancesService` for the actual data.

### src/fragrances/admin-fragrances.controller.ts
**Purpose:** Admin-only CRUD routes.
- Handles create/update/delete for fragrances.
- Protected by `JwtAuthGuard` + `RolesGuard`.
- Uses DTOs to validate incoming admin data.

### src/fragrances/fragrances.service.ts
**Purpose:** Business logic and database access.
- Builds query filters and pagination.
- Talks to Prisma to read/write data.
- Contains create/update/delete logic and relations.

### src/fragrances/dto/create-fragrance.dto.ts
**Purpose:** Validates the request body when creating a fragrance.
- Defines required fields (name, slug, price, etc.).
- Ensures correct types before reaching the service.

### src/fragrances/dto/update-fragrance.dto.ts
**Purpose:** Validates partial updates.
- Same fields as create, but optional.
- Used for admin updates.

### src/fragrances/dto/fragrance-query.dto.ts
**Purpose:** Validates query params for listing.
- Filters (search, collectionId, noteId, price range, etc.).
- Pagination (page, limit).

## How These Files Work Together
1) A request hits a controller (public or admin).
2) DTOs validate input (body or query).
3) The controller calls `FragrancesService`.
4) The service builds a Prisma query and returns results.
5) The controller returns the response to the client.

## How It Works (Teach‑Through)
1) A request hits a controller (public or admin).
2) DTOs validate the input (body or query).
3) `FragrancesService` performs the business logic.
4) Data is stored and read through `PrismaService`.

Think of the controller as the receptionist and the service as the manager who does the real work.

## Real‑World Scenario (Car Dealership)
Imagine a car dealership:

- Public showroom = public fragrance list and detail.
- Sales manager system = admin CRUD tools.
- Inventory database = Prisma + PostgreSQL.

Example flow (shopper browsing):
1) A shopper asks for “red sports cars under $30k” (GET /api/fragrances with filters).
2) The showroom desk checks the request format (query DTO).
3) The manager searches inventory (service + Prisma).
4) The shopper gets a filtered list back.

Example flow (admin adding a car):
1) Admin submits a new listing (POST /api/admin/fragrances + `CreateFragranceDto`).
2) Guards verify admin access.
3) Service saves the new inventory record.
4) The new item appears in the public showroom list.

## Responsibilities
### FragrancesController (Public)
- Public listing with filters and pagination.
- Public detail by slug.

### AdminFragrancesController (Admin)
- Admin CRUD for fragrances.

### FragrancesService
- Reads and writes fragrance data.
- Applies filters, pagination, and search.

## Public Filters (Query)
- `search` (name/description)
- `collectionId`
- `noteId`
- `concentration`
- `sizeMl`
- `featured`
- `minPriceCents` / `maxPriceCents`
- `page` / `limit`

## Endpoints
### Public
- GET /api/fragrances
- GET /api/fragrances/:slug

### Admin
- GET /api/admin/fragrances
- POST /api/admin/fragrances
- PUT /api/admin/fragrances/:id
- DELETE /api/admin/fragrances/:id

## DTOs (Input Shapes)
### CreateFragranceDto
- Required fields to create a fragrance.
- Optional notes and flags.

### UpdateFragranceDto
- Same fields as `CreateFragranceDto`, but optional for partial updates.

### FragranceQueryDto
- Optional query params for filtering and pagination.

DTOs are the contract for incoming data. Invalid input returns 400 before it reaches the service.

## Access Control
- Public endpoints are marked with `@Public()`.
- Admin endpoints require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.

## Error Handling
- Validation errors: 400
- Auth errors: 401/403
- Not found: 404

## Notes for Testing
- Unit test `FragrancesService` for filtering, pagination, and not-found cases.
- Controller tests should verify 401/403 for admin routes and 200 for public list.
