# E2E Testing

## Why E2E?
E2E tests validate full API flows (controllers + services + DB) from the outside, which is effectively integration testing at the system level.

## Real‑World Scenario (Perfume Shop)
Think of E2E tests like checking the full customer journey in a perfume store:

- **Auth**: a customer creates an account, then logs in to get access.
- **Fragrances**: the customer browses the catalog and opens a product page.
- **Orders**: the customer buys a perfume and later views their order history.

If any step fails, the real customer journey would break, so E2E tests protect the full flow.

## Planned Flows
- Auth: register → login → get token
- Fragrances: list public → get by slug
- Orders: create order → list my orders

## How to Run
- E2E tests: npm run test:e2e

## Notes
- Use a test database or isolated schema.
- Seed minimal data required for the flows.
