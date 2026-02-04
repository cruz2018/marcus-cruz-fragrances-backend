# Testing Strategy (Phase 6)

## Goal
Prevent regressions by covering core services and API flows with unit + E2E tests.

## Why This Strategy
This project uses a **test pyramid** approach: many fast unit tests, fewer controller/integration tests, and a small number of E2E tests.

**Why:**
- Unit tests are cheap and fast, so we can cover most logic with high confidence.
- Controller tests validate request/response wiring without running a full server.
- E2E tests are slow and fragile but prove the full system works.

This is not “wrong” — it’s the standard balance most teams use to get speed + confidence.

## Are We Wrong for Not “All Pyramid”?
No. We are following the pyramid. The goal is not a perfect triangle; the goal is **risk reduction**:
- If business logic changes, unit tests catch it fast.
- If route wiring breaks, controller tests catch it.
- If the whole system breaks, E2E tests catch it.

If your product later needs more integration testing (DB + services together), we can add a **diamond** shape (more integration tests) instead of a strict pyramid. That is common in real teams.

## Scope
- Unit tests: services (business logic)
- Controller tests: route validation and response shape
- E2E tests: auth, fragrances, orders

## Test Pyramid
1) Unit tests (fast, many)
2) Controller tests (medium)
3) E2E tests (slow, few, critical paths)

### When to Add Integration Tests
Add integration tests when:
- You need to validate Prisma queries against a real database.
- You want to test guards + pipes + interceptors together.
- A bug only appears when components interact.

Integration tests should sit between controller tests and E2E tests in cost and speed.

## Plan
### 1) Unit Tests (Services)
Target services:
- AuthService
- UsersService
- FragrancesService
- NotesService
- CollectionsService
- OrdersService

User stories per service:
- AuthService: As a user, I want to register and log in securely.
- UsersService: As a user/admin, I want profile access and user listing.
- FragrancesService: As a shopper/admin, I want catalog access and CRUD.
- NotesService: As a shopper/admin, I want note catalog and CRUD.
- CollectionsService: As a shopper/admin, I want collections and CRUD.
- OrdersService: As a user/admin, I want order creation and listing.

What to cover:
- Happy path logic
- Error cases (not found, invalid input)
- Edge cases (empty results, disabled user)

### 2) Controller Tests
Target controllers:
- AuthController
- UsersController
- FragrancesController
- AdminFragrancesController
- NotesController
- CollectionsController
- OrdersController

What to cover:
- Valid requests return expected status
- Invalid input returns 400
- Auth‑protected routes reject unauthenticated requests

### 3) E2E Tests (Critical Flows)
Flows:
- Auth: register → login → get token
- Fragrances: list public → get by slug
- Orders: create order → list my orders

What to validate:
- Status codes
- Response structure
- Authentication and authorization
- Data integrity (IDs, counts)

## Progress Checklist
- [ ] AuthService unit tests
- [ ] UsersService unit tests
- [ ] FragrancesService unit tests
- [ ] NotesService unit tests
- [ ] CollectionsService unit tests
- [ ] OrdersService unit tests
- [ ] Controller tests (core)
- [ ] E2E auth flow
- [ ] E2E fragrance flow
- [ ] E2E orders flow

## How to Run
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`

## What “Good Coverage” Looks Like
- Services: 80–90% (most business logic)
- Controllers: 60–80% (route + validation wiring)
- E2E: a few critical flows (auth, browse, purchase)

Coverage should increase **after** more tests are added, not before.

## Coverage Tracking
- Run `npm run test:cov` to generate coverage.
- Reports are written to coverage/ (lcov + summaries).
- Global thresholds are enforced in package.json (fail if below).
