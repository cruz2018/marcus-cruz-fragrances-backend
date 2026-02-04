# Collections Module

## Overview
The Collections module groups fragrances into curated collections. It exposes a public list endpoint and admin CRUD endpoints.

## Key Files
- src/collections/collections.module.ts
- src/collections/collections.controller.ts
- src/collections/collections.service.ts
- src/collections/dto/create-collection.dto.ts
- src/collections/dto/update-collection.dto.ts

## How It Works (Teach‑Through)
1) A request hits `CollectionsController`.
2) The controller validates the input using DTOs and passes control to `CollectionsService`.
3) The service reads/writes data via `PrismaService`.
4) The controller returns a clean response.

Think of the controller as the receptionist (validates and routes) and the service as the manager (actual business logic).

## Real‑World Scenario (Build a House)
Imagine you want to build a house:

- `CollectionsController` = the city hall front desk. It checks your forms and permissions.
- `CollectionsService` = the construction manager who actually builds the house.
- `PrismaService` = the land records office where the final house record is stored.

Example flow (admin creates a collection):
1) You submit the build request (POST /api/collections/admin + `CreateCollectionDto`).
2) The front desk verifies your permit (JWT + admin role).
3) The manager builds and files the record (service + Prisma).
4) Everyone can later view the list of finished houses (GET /api/collections).

## Responsibilities
### CollectionsController
- Exposes HTTP routes for collections.
- Enforces public vs. admin access.
- Uses DTOs for request validation.

### CollectionsService
- Public list of collections.
- Admin CRUD operations (create, update, delete, list all).

## Endpoints
### Public
- GET /api/collections

### Admin
- GET /api/collections/admin
- POST /api/collections/admin
- PUT /api/collections/admin/:id
- DELETE /api/collections/admin/:id

## DTOs (Input Shapes)
### CreateCollectionDto
- `name`: string (required)
- `slug`: string (required)
- `description`: string (optional)

### UpdateCollectionDto
- Same fields as `CreateCollectionDto`, but all optional for partial updates.

DTOs are the “contract” for incoming data. If a required field is missing or the type is wrong, the request fails with 400 before it hits the service.

## Access Control
- Public list is open.
- Admin routes require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.

## Common Flows
### Public list
1) Client calls GET /api/collections
2) Controller calls `CollectionsService.findAll()`
3) Service returns collections list

### Admin create
1) Admin calls POST /api/collections/admin with `CreateCollectionDto`
2) Guards verify JWT and admin role
3) Service creates the collection and returns it

## Error Handling
- Validation errors: 400 (from DTO validation)
- Auth errors: 401/403 (from guards)
- Not found: 404 (from service when a collection is missing)

## Notes for Testing
- Unit test `CollectionsService` for happy paths and missing record cases.
- Controller tests should verify 401/403 for admin routes and 200 for public list.
