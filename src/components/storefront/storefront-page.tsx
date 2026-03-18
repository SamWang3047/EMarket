"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  type ProductCategory
} from "@/lib/constants";
import { useProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const PAGE_SIZE = 6;

function formatCurrency(priceInCents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(priceInCents / 100);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden bg-[color:var(--surface-strong)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(217,187,164,0.32),rgba(255,255,255,0.84))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,102,52,0.2),transparent_35%)]" />
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            No image
          </div>
        )}
      </div>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge>{CATEGORY_LABELS[product.category]}</Badge>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)]">
                {product.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {product.description ?? "Curated gear for a cleaner workspace."}
              </p>
            </div>
          </div>
          <span className="text-right text-lg font-semibold text-[var(--text)]">
            {formatCurrency(product.price)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>{product.stock} in stock</span>
          <Button size="sm">Add to cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden bg-[color:var(--surface-strong)]"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StorefrontPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >();
  const [isPending, startTransition] = useTransition();
  const deferredCategory = useDeferredValue(selectedCategory);
  const { data, isLoading, isFetching, error } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    category: deferredCategory
  });

  const products = data?.items ?? [];
  const pagination = data?.pagination;

  const handleCategoryChange = (category?: ProductCategory) => {
    startTransition(() => {
      setSelectedCategory(category);
      setPage(1);
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-8 px-4 py-5 md:px-8 md:py-8">
      <header className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl md:px-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-white shadow-[0_16px_30px_rgba(198,102,52,0.28)]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                EMarket
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] md:text-3xl">
                Build-first storefront
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white/65 px-4 py-3 text-sm text-[var(--muted)]">
            <ShoppingBag className="h-4 w-4" />
            <span>
              Cart UI lands on Day 5. API and inventory flow are ready.
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.95fr)]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-5 p-6 md:p-8">
            <Badge>Day 4</Badge>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl font-semibold leading-none tracking-tight text-[var(--text)] md:text-6xl">
                Responsive catalog with real API data and a front-end shape that
                scales.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                React Query owns data-fetching, the UI stays focused on
                rendering, and the page is ready for cart and checkout flows
                without rewiring the data layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Browse collection</Button>
              <Button variant="secondary" size="lg">
                API-backed filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(241,230,216,0.7))]">
          <CardContent className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Data strategy
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                `useProducts` encapsulates pagination and category filtering,
                keeping components declarative.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Rendering strategy
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Deferred category updates and loading skeletons keep transitions
                feeling intentional instead of jarring.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Shop by workflow
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? "default" : "secondary"}
              size="sm"
              onClick={() => handleCategoryChange(undefined)}
            >
              All
            </Button>
            {PRODUCT_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? "default" : "secondary"
                }
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {CATEGORY_LABELS[category]}
              </Button>
            ))}
          </div>
        </div>

        {(isLoading || isPending) && <ProductGridSkeleton />}

        {!isLoading && !isPending && error ? (
          <Card>
            <CardContent className="p-6 text-sm text-[var(--muted)]">
              Failed to load products. {error.message}
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isPending && !error ? (
          <>
            <div
              className={cn(
                "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
                isFetching && "opacity-70 transition-opacity"
              )}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[var(--muted)]">
                Showing page {pagination?.page ?? 1} of{" "}
                {pagination?.totalPages ?? 1}
                {" · "}
                {pagination?.total ?? 0} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={!pagination || pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((current) => current + 1)}
                  disabled={
                    !pagination || pagination.page >= pagination.totalPages
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
