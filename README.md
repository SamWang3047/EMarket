# EMarket

EMarket is a compact ecommerce showcase project built with `Next.js`, `TypeScript`, `PostgreSQL`, and `Prisma`.

The focus is engineering quality over feature volume: clear structure, testable flows, and deployable setup.

## Highlights

- Product listing with category filters and pagination
- Local cart state (`Zustand` + `localStorage`)
- Transactional checkout and stock deduction
- Scroll-driven homepage interactions (stacked cards, metrics animation, floating CTA)
- 3-theme runtime switcher with persistence
- Docker-based local database setup
- GitHub Actions CI pipeline

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker (for local PostgreSQL)

### Run locally

```bash
cp .env.example .env
pnpm install
docker compose up -d db
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open:

- `http://127.0.0.1:4510`
- `http://127.0.0.1:4510/checkout`

## Common Commands

```bash
pnpm dev            # start dev server
pnpm build          # production build
pnpm test           # run tests
pnpm check          # lint + format + typecheck + test
pnpm format         # format files
pnpm db:migrate     # run local migrations
pnpm db:seed        # seed demo data
```

## Theme Colors (Three Variants)

![Demo GIF](demo.gif)

Theme switching is available from the homepage header and persisted to `localStorage`.

### 1) Sand

- Style: warm, neutral, default showcase palette
- Good for: general demos and product presentation

### 2) Evergreen

- Style: deep green family, calm and grounded
- Good for: trust-oriented and product-focused presentation

### 3) Graphite

- Style: high-contrast dark palette, technical look
- Good for: night demos and dense visual content

Theme tokens:

- `src/app/globals.css`

Theme switching logic:

- `src/components/storefront/storefront-page.tsx`
- `src/app/layout.tsx` (theme bootstrap on initial load)

## Continuous Integration

Workflow file:

- `.github/workflows/ci.yml`

Triggers:

- Push to `main`
- Pull request to `main`
- Manual trigger (`workflow_dispatch`)

Pipeline steps:

1. Install dependencies
2. Prisma generate + migrate deploy
3. `pnpm check`
4. `pnpm build`

## Project Structure (Compact)

```text
src/
  app/                # pages and API routes
  components/         # feature and UI components
  hooks/              # React hooks
  server/             # services, repositories, schemas
  stores/             # Zustand stores
prisma/
  schema.prisma
  seed.ts
tests/
  order-service.test.ts
.github/workflows/
  ci.yml
```

## Notes

- Checkout currently uses a demo user (full auth is intentionally out of scope)
- Prices are stored as integer cents to avoid floating-point errors
- Critical order transaction behavior is covered by tests
