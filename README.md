# EMarket

EMarket is an editorial ecommerce showcase built with Next.js, TypeScript,
PostgreSQL, and Prisma. It combines a polished, scroll-driven storefront with a
small but production-minded backend: validated API boundaries, transactional
order creation, safe database tooling, and deployable standalone output.

This is a demo application rather than a complete commerce platform. The
storefront is public, checkout uses a seeded demo customer, and authentication,
payment processing, fulfilment, and an admin interface are intentionally out of
scope.

## Features

- Responsive storefront with a scroll-reactive hero, reveal animations,
  animated metrics, curated collections, and a guided product story
- Server-backed catalog with six category filters, pagination, loading states,
  and product detail dialogs
- Persistent local bag state with stock-aware quantities, a cart sheet, and a
  dedicated checkout page
- React Hook Form and Zod validation for shipping details and order payloads
- Transactional order creation that recalculates prices on the server,
  atomically decrements stock, and rolls back when inventory is insufficient
- Service and repository layers that keep HTTP, business, and persistence logic
  separate
- Docker, Vercel/Neon, and GitHub Actions workflows for repeatable production
  builds

## Tech stack

- Next.js 15 and React 19
- TypeScript and Tailwind CSS 4
- TanStack Query and Zustand
- React Hook Form and Zod
- Prisma 6 and PostgreSQL 16
- Radix UI, Lucide, and Sonner
- Vitest, ESLint, Prettier, Husky, and lint-staged

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker with Docker Compose

### Local development

Copy `.env.example` to `.env`, then run:

```bash
pnpm install
docker compose up -d db
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

On PowerShell, the copy command is:

```powershell
Copy-Item .env.example .env
```

The development server is fixed to `http://127.0.0.1:4510` by the `dev`
script. The main routes are:

- `/` — storefront and product catalog
- `/checkout` — bag review and order submission

The seed is required for the demo catalog and checkout customer. It also adds a
sample database cart item, although the current browser bag is stored locally by
Zustand.

## Commands

| Command             | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Start the Turbopack development server on port 4510            |
| `pnpm build`        | Create standalone production output and copy its static assets |
| `pnpm start`        | Run the previously built standalone server                     |
| `pnpm lint`         | Run ESLint with zero warnings allowed                          |
| `pnpm format`       | Format supported files with Prettier                           |
| `pnpm format:check` | Check formatting without modifying files                       |
| `pnpm typecheck`    | Run TypeScript without emitting files                          |
| `pnpm test`         | Run the Vitest suite once                                      |
| `pnpm test:watch`   | Run Vitest in watch mode                                       |
| `pnpm check`        | Run lint, formatting, type checking, and tests                 |
| `pnpm db:generate`  | Generate Prisma Client                                         |
| `pnpm db:migrate`   | Create or apply local development migrations                   |
| `pnpm db:push`      | Push the schema directly for disposable development databases  |
| `pnpm db:seed`      | Reset application data and create the demo users and catalog   |

The pre-commit hook runs lint-staged, which applies ESLint fixes and Prettier to
staged source files.

## Configuration

The checked-in `.env.example` documents the local defaults.

| Variable                                                             | Usage                                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                       | Required PostgreSQL connection used by the application and Prisma                     |
| `DIRECT_URL`                                                         | Direct database connection for migrations; required for Vercel production deployments |
| `NODE_ENV`                                                           | Runtime mode: `development`, `test`, or `production`                                  |
| `PORT`                                                               | Port used by the standalone server; the development script ignores it                 |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` | Docker Compose database settings                                                      |
| `APP_PORT`                                                           | Host port published by the Docker application service                                 |
| `ALLOW_REMOTE_DATABASE_SEED`                                         | Explicit opt-in for seeding an ambiguously named remote, non-production database      |

Do not expose database variables to client code. They are server-only and do
not use the `NEXT_PUBLIC_` prefix.

## API

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Validation and application errors use the same shape with `data: null` and an
error containing a code and message.

### `GET /api/products`

Returns active, non-deleted products and pagination metadata.

Supported query parameters:

- `page` — positive integer, default `1`
- `pageSize` — integer from `1` to `50`, default `12`
- `category` — `KEYBOARDS`, `MICE`, `MONITORS`, `AUDIO`, `STORAGE`, or
  `DESK_SETUP`

The storefront requests nine products per page.

### `POST /api/orders`

Creates an order for the server-selected demo customer.

```json
{
  "shippingAddress": "Demo Customer, 48 Harbour Street, Sydney NSW 2000",
  "items": [
    {
      "productId": "00000000-0000-0000-0000-000000000000",
      "quantity": 1
    }
  ]
}
```

Client-controlled identity fields are rejected. Duplicate product lines are
merged, current product prices are used, inventory changes occur inside one
transaction, and a successful request returns a public order receipt with HTTP
`201`.

## Database and seed safety

The Prisma schema contains `User`, `Product`, `CartItem`, `Order`, and
`OrderItem` models. Product prices and order totals are stored as integer cents
and displayed as AUD.

`pnpm db:seed` deletes existing application records before recreating the demo
users and catalog. To reduce the risk of data loss, seeding:

- is always blocked when `NODE_ENV=production`
- allows local PostgreSQL hosts
- allows clearly named remote development or test databases
- requires `ALLOW_REMOTE_DATABASE_SEED=true` for any other remote database

Use the override only with a disposable, non-production database.

## Testing

The suite includes unit tests for storefront configuration, bag behavior,
currency formatting, order validation, and seed safety. Database-backed suites
cover product persistence, public order receipts, transactional stock updates,
rollback behavior, and competing orders.

Database suites run only when `NODE_ENV=test`, the database name contains
`test`, and PostgreSQL is reachable. Otherwise, they are skipped while the unit
tests continue to run.

To run the complete suite locally, first create an empty test database, then set
its URL and apply migrations:

```powershell
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/emarket_test?schema=public'
pnpm db:generate
pnpm exec prisma migrate deploy
pnpm test
```

For Bash or zsh, use `export DATABASE_URL=...` instead of the PowerShell
assignment.

## Production and deployment

### Standalone Node.js

```bash
pnpm build
pnpm start
```

The post-build script copies `public` and `.next/static` into the standalone
bundle so it can run independently.

### Docker Compose

```bash
docker compose up --build
```

Compose binds PostgreSQL to localhost, waits for it to become healthy, applies
migrations in a one-shot container, and then starts the application as an
unprivileged user. The database volume persists between runs. Migrations do not
seed demo data automatically; run `pnpm db:seed` separately against a safe
non-production database when needed.

Set a strong, unique `POSTGRES_PASSWORD` before exposing any deployment.

### Vercel with Neon

Set the following Vercel environment variables before the first production
deployment:

- `DATABASE_URL` — the Neon pooled connection URL, whose hostname contains
  `-pooler`
- `DIRECT_URL` — the Neon direct connection URL used for migrations

Vercel builds generate Prisma Client in every environment. Pending migrations
are deployed only for production builds, using `DIRECT_URL`; preview builds skip
them. Functions run in the Sydney `syd1` region.

## Continuous integration

`.github/workflows/ci.yml` runs on every push, pull requests targeting `main`,
and manual dispatches. Concurrent runs for the same ref cancel older runs.

The workflow contains two jobs:

1. `quality` provisions PostgreSQL, validates the Prisma schema, applies
   migrations, and runs `pnpm check` against `emarket_test`.
2. `build` repeats the database setup, creates the production application and
   runtime image, starts the container, and smoke-tests `/api/products` and `/`.

## Project structure

```text
src/
  app/
    api/
      orders/                  # transactional order endpoint
      products/                # filtered and paginated catalog endpoint
    checkout/                  # checkout route
    layout.tsx                 # global providers and metadata
    page.tsx                   # storefront route
  components/
    checkout/                  # checkout UI and form
    product/                   # shared product image rendering
    providers/                 # TanStack Query provider
    storefront/                # homepage, catalog, bag, and product dialog
    ui/                        # reusable UI primitives
  hooks/                       # client-side API queries
  lib/                         # API helpers, environment, Prisma, and utilities
  server/
    repositories/              # database reads and receipt projections
    schemas/                   # request and query validation
    services/                  # catalog and transactional order logic
  stores/                      # persistent Zustand bag state
  types/                       # shared TypeScript types
prisma/
  migrations/                  # versioned PostgreSQL migrations
  schema.prisma                # application data model
  seed.ts                      # guarded demo data reset
scripts/                       # production migration and standalone helpers
tests/                         # unit and database-backed Vitest suites
.github/workflows/ci.yml       # quality, build, and smoke-test pipeline
```
