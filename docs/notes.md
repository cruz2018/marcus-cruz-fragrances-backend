# Notes Module

## Overview
The Notes module manages fragrance notes (e.g., bergamot, cedar) used for composition and filtering.

## Key Files
- src/notes/notes.module.ts
- src/notes/notes.controller.ts
- src/notes/notes.service.ts
- src/notes/dto/create-note.dto.ts
- src/notes/dto/update-note.dto.ts

## Key Files Explained (What Each One Does)
### src/notes/notes.module.ts
**Purpose:** Wires the Notes feature into NestJS.
- Registers the controller and service.

### src/notes/notes.controller.ts
**Purpose:** HTTP routes for notes.
- Public list route.
- Admin CRUD routes (protected).

### src/notes/notes.service.ts
**Purpose:** Business logic and database access.
- Reads and writes notes with Prisma.

### src/notes/dto/create-note.dto.ts
**Purpose:** Validates note creation input.
- Requires `name` and `slug`.

### src/notes/dto/update-note.dto.ts
**Purpose:** Validates partial updates.
- Same fields as create, but optional.

## How These Files Work Together
1) A request hits the controller.
2) DTOs validate input (when creating/updating).
3) The controller calls `NotesService`.
4) The service uses `PrismaService` to read/write.
5) The controller returns the response.

## How It Works (Teach‑Through)
1) A request hits `NotesController`.
2) DTOs validate the input.
3) `NotesService` performs the logic.
4) Data is stored and read through `PrismaService`.

## Real‑World Scenario (Kitchen Pantry)
Think of notes like spices in a pantry:

- Public list = the menu board showing available spices.
- Admin CRUD = the chef adding, renaming, or removing spices.
- Database = the pantry inventory list.

Example flow (public list):
1) A customer asks, “What spices are available?” (GET /api/notes)
2) The board shows the list (service + Prisma)

Example flow (admin add):
1) Chef adds “Bergamot” (POST /api/notes/admin + `CreateNoteDto`)
2) Guards verify admin access
3) Service saves the new spice in the inventory

## Endpoints
### Public
- GET /api/notes

### Admin
- GET /api/notes/admin
- POST /api/notes/admin
- PUT /api/notes/admin/:id
- DELETE /api/notes/admin/:id

## DTOs (Input Shapes)
### CreateNoteDto
- `name`: string (required)
- `slug`: string (required)

### UpdateNoteDto
- Same fields as `CreateNoteDto`, but optional.

## Access Control
- Public list is open.
- Admin routes require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.

## Notes for Testing
- Unit test `NotesService` for list, create, update, and delete.
