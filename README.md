# EMarket

EMarket is a compact ecommerce showcase built with `Next.js`, `TypeScript`, `PostgreSQL`, and `Prisma`.

It is intentionally small in scope and biased toward engineering quality: clear module boundaries, transactional backend flows, and a homepage that behaves like a polished product demo instead of a CRUD template.

![Project Preview](image-2.png)

## Highlights

- Scroll-driven storefront homepage with stacked product cards, animated metrics, and floating CTA behavior
- Product catalog with category filters, pagination, and in-page product detail modal
- Local bag state powered by `Zustand` with checkout summary and transactional order creation
- PostgreSQL + Prisma backend with service and repository layers
- Runtime theme switcher with three palettes: `Sand`, `Evergreen`, and `Graphite`
- GitHub Actions pipeline for quality checks, database-backed tests, and production build verification

## Stack

- Next.js 15
- React 19
- TypeScript
- Prisma
- PostgreSQL
- Zustand
- Zod
- Vitest

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker

### Local development

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

## Commands

```bash
pnpm dev            # start the local dev server
pnpm build          # create a production build
pnpm test           # run the Vitest suite
pnpm check          # lint + format + typecheck + test
pnpm format         # format the repo
pnpm db:generate    # regenerate Prisma client
pnpm db:migrate     # run local migrations
pnpm db:seed        # seed demo data
```

## Themes

![Theme Demo](demo.gif)

Theme switching is available in the storefront header and is persisted in `localStorage`.

### Sand

Warm neutral palette intended for default product demos.

### Evergreen

Deep green palette for a calmer and more grounded storefront look.

### Graphite

High-contrast dark palette for denser, more technical presentation.

Theme tokens live in `src/app/globals.css`. Theme state is handled from `src/components/storefront/storefront-page.tsx` and `src/components/storefront/storefront-page-hooks.ts`.

## Testing

The test suite mixes fast unit tests with database-backed integration tests.

Current coverage includes:

- storefront configuration helpers
- cart store behavior
- currency formatting
- order service transactions
- order repository relation loading
- Prisma product CRUD

### Important test database rule

Database integration tests only run when `DATABASE_URL` points to a database whose name contains `test`.

This is a deliberate safeguard to prevent test cleanup from wiping development data.

Example:

```bash
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/emarket_test?schema=public
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm test
```

If you are using PowerShell:

```powershell
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/emarket_test?schema=public'
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm test
```

## CI

Workflow file: `.github/workflows/ci.yml`

The pipeline has two jobs:

1. `quality`
2. `build`

`quality` provisions PostgreSQL, targets `emarket_test`, validates Prisma, applies migrations, and runs `pnpm check`.

`build` runs after `quality` succeeds and verifies the production build.

Triggers:

- push to any branch
- pull requests targeting `main`
- manual dispatch

## Project Structure

```text
src/
  app/                         # app router pages and API routes
  components/
    checkout/                  # checkout screen
    product/                   # shared product image rendering
    providers/                 # query provider
    storefront/                # storefront modules and homepage sections
    ui/                        # reusable UI primitives
  hooks/                       # client data hooks
  lib/                         # shared helpers, env, constants, formatters
  server/                      # repositories, services, schemas, errors
  stores/                      # Zustand state
  types/                       # shared TypeScript types
prisma/
  schema.prisma
  seed.ts
  migrations/
tests/
  helpers/
  storefront-page-config.test.ts
  cart-store.test.ts
  format.test.ts
  order-service.test.ts
  order-repository.test.ts
  prisma-product-crud.test.ts
.github/workflows/
  ci.yml
```
