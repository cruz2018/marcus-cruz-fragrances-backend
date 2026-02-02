# Prisma + Database

Files
- prisma/schema.prisma
- src/prisma/prisma.module.ts
- src/prisma/prisma.service.ts
- prisma/seed.ts

## Purpose
Defines the data model and provides a shared Prisma client for all modules.

## schema.prisma
Core concepts
- Enums for Role, OrderStatus, NoteType.
- Models for User, Collection, Note, Fragrance, FragranceNote, Order, OrderItem.
- Relations define foreign keys and join tables.
- Indexes optimize read-heavy catalog queries.

Model overview
- User: identity, role, account status, orders.
- Collection: product grouping.
- Note: fragrance notes catalog.
- Fragrance: product catalog and pricing.
- FragranceNote: many-to-many join with note type (TOP/HEART/BASE).
- Order: user order with status and totals.
- OrderItem: line items with quantity and unit price.

## PrismaModule
- Global module so Prisma client is injected anywhere without re-importing.

## PrismaService
- Extends `PrismaClient`.
- Connects on module init.
- Disconnects on module destroy.

## Seed
- Creates an admin user.
- Creates a collection and notes.
- Creates a featured fragrance with note composition.
