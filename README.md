## Marcus Cruz Fragrances Backend (MVP)

Production-ready NestJS backend for a premium fragrance brand. Built for free tiers with PostgreSQL, Prisma, JWT auth, Swagger, and Jest.

### Tech stack
- Node.js LTS
- NestJS + TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- Swagger docs
- Jest tests

## Step-by-step setup

1) Install dependencies

2) Configure environment
- Copy .env.example to .env
- Set DATABASE_URL and DIRECT_URL for Neon/Supabase
- Set JWT_SECRET

3) Initialize Prisma
- Generate client
- Run migrations

4) Run the API
- Start the app in dev mode

## Prisma schema
See prisma/schema.prisma for the full data model:
- User
- Fragrance
- Note
- Collection
- Order
- OrderItem

## Auth module
- Register: POST /api/auth/register
- Login: POST /api/auth/login
- JWT Bearer auth for protected routes

## Fragrance module
Public catalog:
- GET /api/fragrances
- GET /api/fragrances/:slug

Admin CRUD:
- GET /api/admin/fragrances
- POST /api/admin/fragrances
- PUT /api/admin/fragrances/:id
- DELETE /api/admin/fragrances/:id

Filters:
- collectionId
- noteId
- concentration
- minPriceCents, maxPriceCents
- sizeMl
- featured

## Notes & Collections
Public lists:
- GET /api/notes
- GET /api/collections

Admin CRUD:
- /api/notes/admin
- /api/collections/admin

## Orders
Authenticated:
- POST /api/orders
- GET /api/orders/me

Admin:
- GET /api/admin/orders

## Swagger documentation
Swagger UI is available at /api/docs when the app is running.

## Free-tier friendly configuration
- Stateless JWT auth
- Prisma with pooled DATABASE_URL and DIRECT_URL for migrations
- Minimal background tasks
- Optimized for Render/Railway/Fly.io free tiers

## Deployment notes
- Set NODE_ENV=production
- Provide DATABASE_URL, DIRECT_URL, JWT_SECRET
- Build: npm run build
- Start: npm run start:prod

## Admin access
Create a user via /api/auth/register, then promote to admin via Prisma or SQL:
- Set role to ADMIN in the User record
