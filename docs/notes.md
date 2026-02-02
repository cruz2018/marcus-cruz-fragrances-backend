# Notes Module

Files
- src/notes/notes.module.ts
- src/notes/notes.controller.ts
- src/notes/notes.service.ts
- src/notes/dto/create-note.dto.ts
- src/notes/dto/update-note.dto.ts

## Purpose
Manages fragrance notes used for composition and filtering.

## NotesService
Responsibilities
- Public list of notes.
- Admin CRUD.

## Endpoints
Public
- GET /api/notes

Admin
- GET /api/notes/admin
- POST /api/notes/admin
- PUT /api/notes/admin/:id
- DELETE /api/notes/admin/:id

## DTOs
- `CreateNoteDto`: name + slug.
- `UpdateNoteDto`: partial update of `CreateNoteDto`.

## Access Control
- Public list is open.
- Admin routes require `JwtAuthGuard` + `RolesGuard` with `Role.ADMIN`.
