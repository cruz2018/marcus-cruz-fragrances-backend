# Project TODO (Real‑world Development)

## Phase 1 — Setup (Done)
- [x] Scaffold NestJS project
- [x] Install dependencies
- [x] Create .env/.env.example
- [x] ESLint/Prettier
- [x] Initialize git

## Phase 2 — Database (In progress)
User Story: As a developer, I want a real database with seeded data so I can test features end‑to‑end.
- [x] Define Prisma schema
- [x] Run migration
- [x] Seed database
- [x] Verify data via API (Swagger)

## Phase 3 — Core Modules (In progress)
User Story: As a product team, we want a full API for users, products, collections, notes, and orders.
- [x] Auth module
- [x] Users module
- [x] Fragrances module
- [x] Notes module
- [x] Collections module
- [x] Orders module
- [x] Validate endpoints in Swagger

## Phase 4 — Security & Validation (In progress)
User Story: As a platform owner, I want secure access and clean validation so the API is safe.
- [x] JWT auth + guards
- [x] Roles + decorators
- [x] DTO validation
- [x] Exception filter
- [x] Rate limit config verified

## Phase 5 — Documentation (In progress)
User Story: As a developer, I want clear API docs to use and test endpoints.
- [x] Swagger setup
- [x] ApiTags/ApiResponses
- [ ] Review all DTO annotations

## Phase 6 — Testing (Next)
User Story: As QA, I want unit + E2E tests to prevent regressions.
- [ ] Unit tests (services)
- [ ] Controller tests
- [ ] E2E tests (auth, fragrances, orders)

## Phase 7 — Production Features (Next)
User Story: As an operator, I want stability and observability in production.
- [x] Helmet + CORS
- [x] Health check
- [x] Request logging
- [x] Indexes + pagination
- [ ] Add rate limiting docs

## Phase 8 — Deployment (Later)
User Story: As a founder, I want a deployable app on free tier infra.
- [ ] Dockerfile
- [ ] docker-compose
- [ ] Render/Railway/Fly config
- [ ] Production migrations

## Week 1 — React Admin (Optional)
User Story: As admin, I want a UI to manage users, products, and orders.
- [ ] Create React admin app
- [ ] Login + token storage
- [ ] List + create/update views
- [ ] Status views
