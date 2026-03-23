"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { Package2, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  type ProductCategory
} from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { useProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

const PAGE_SIZE = 6;

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="overflow-hidden border-[color:var(--border)] bg-white/80">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(248,239,229,0.96),rgba(240,231,222,0.78))]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            No image available
          </div>
        )}
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Badge>{CATEGORY_LABELS[product.category]}</Badge>
            <span className="text-sm font-semibold text-[var(--muted)]">
              {product.stock} in stock
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight text-[var(--text)]">
              {product.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
              {product.description ??
                "Curated hardware for focused daily work."}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Price
            </p>
            <p className="mt-1 text-xl font-semibold text-[var(--text)]">
              {formatCurrency(product.price)}
            </p>
          </div>
          <Button
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to cart.`);
            }}
            disabled={product.stock <= 0}
          >
            Add to cart
          </Button>
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
          className="overflow-hidden border-[color:var(--border)] bg-white/80"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-14 w-full" />
            <Separator />
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28 rounded-xl" />
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
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-8 px-4 py-5 md:px-8 md:py-8">
      <header className="sticky top-4 z-20 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--text)] text-white">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                EMarket
              </p>
              <h1 className="text-xl font-semibold text-[var(--text)] md:text-2xl">
                Hardware store for focused teams
              </h1>
            </div>
          </div>
          <CartSheet />
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_400px]">
        <Card className="border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,240,232,0.88))]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <Badge>Storefront</Badge>
            <div className="space-y-4">
              <h2 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-tight text-[var(--text)] md:text-6xl">
                Standard tools, predictable patterns, and a UI that behaves like
                a real product.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                The catalog is backed by React Query, the cart lives in Zustand,
                and checkout is powered by react-hook-form plus server-side
                validation. The point is not novelty. The point is a
                maintainable shape.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                <p className="mt-3 text-sm font-semibold text-[var(--text)]">
                  API-backed catalog
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Query state, loading, and refetch logic are isolated from UI
                  composition.
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <Package2 className="h-4 w-4 text-[var(--accent)]" />
                <p className="mt-3 text-sm font-semibold text-[var(--text)]">
                  Persistent cart
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Refresh-safe state makes the flow feel like an app, not a demo
                  page.
                </p>
              </div>
              <div className="rounded-2xl border border-[color:var(--border)] bg-white/70 p-4">
                <Truck className="h-4 w-4 text-[var(--accent)]" />
                <p className="mt-3 text-sm font-semibold text-[var(--text)]">
                  Real checkout flow
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Orders still run through the transactional inventory logic
                  from the backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[color:var(--border)] bg-[color:var(--surface-strong)]">
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Filters
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                Browse by category
              </h3>
            </div>
            <Separator />
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
            <Separator />
            <div className="rounded-2xl bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
              Showing page {pagination?.page ?? 1} of{" "}
              {pagination?.totalPages ?? 1} with {pagination?.total ?? 0}{" "}
              products
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        {(isLoading || isPending) && <ProductGridSkeleton />}

        {!isLoading && !isPending && error ? (
          <Card className="border-[color:var(--border)] bg-white/80">
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

            <div className="flex flex-col gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[var(--muted)]">
                Showing page {pagination?.page ?? 1} of{" "}
                {pagination?.totalPages ?? 1} with {pagination?.total ?? 0}{" "}
                products
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
