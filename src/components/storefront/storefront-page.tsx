"use client";

import { useDeferredValue, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
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
    <Card className="group overflow-hidden rounded-[32px] border-[color:var(--border)] bg-[color:var(--surface-strong)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))]">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <Badge>{CATEGORY_LABELS[product.category]}</Badge>
          {product.stock > 5 ? (
            <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Ships today
            </span>
          ) : null}
        </div>
        <ProductImage
          alt={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-[var(--muted)]">
            <Star className="h-3.5 w-3.5 fill-current" />
            Staff pick
          </div>
          <h3 className="text-xl font-semibold text-[var(--text)]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {product.description ??
              "A reliable upgrade for desks that are used every day."}
          </p>
        </div>

        <Separator />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Price
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)]">
              {formatCurrency(product.price)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {product.stock} available
            </p>
          </div>
          <Button
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to bag.`);
            }}
            disabled={product.stock <= 0}
          >
            Add to bag
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
          className="overflow-hidden rounded-[32px] border-[color:var(--border)] bg-[color:var(--surface-strong)]"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Separator />
            <div className="flex items-center justify-between">
              <Skeleton className="h-14 w-28" />
              <Skeleton className="h-10 w-28 rounded-full" />
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
  const featuredProduct = products[0];

  const handleCategoryChange = (category?: ProductCategory) => {
    startTransition(() => {
      setSelectedCategory(category);
      setPage(1);
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-8 px-4 py-4 md:px-8 md:py-8">
      <header className="sticky top-4 z-30 rounded-[30px] border border-[color:var(--border)] bg-[rgba(255,250,244,0.84)] px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--text)] text-white">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                EMarket
              </p>
              <h1 className="text-xl font-semibold text-[var(--text)] md:text-2xl">
                Workspace essentials
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRODUCT_CATEGORIES.slice(0, 4).map((category) => (
              <button
                key={category}
                className="rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-white hover:text-[var(--text)]"
                onClick={() => handleCategoryChange(category)}
                type="button"
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
            <CartSheet />
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
        <Card className="overflow-hidden rounded-[38px] border-[color:var(--border)] bg-[linear-gradient(135deg,#fff8f1_0%,#f1dfd1_48%,#e7d1c3_100%)]">
          <CardContent className="grid gap-8 p-6 md:p-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
            <div className="space-y-6">
              <Badge>New season desk edit</Badge>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-5xl font-semibold leading-[0.92] tracking-tight text-[var(--text)] md:text-7xl">
                  Build a calmer setup without guessing what to buy.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                  Curated keyboards, monitors, audio gear, and desk accessories
                  for people who use their workspace every day.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => handleCategoryChange(undefined)}
                >
                  Shop all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/checkout">Go to checkout</Link>
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-3xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Fast dispatch
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    Same-day on stocked items
                  </p>
                </div>
                <div className="rounded-3xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Curated range
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    No filler catalog bloat
                  </p>
                </div>
                <div className="rounded-3xl bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Return window
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    30 days for peace of mind
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[30px] border border-white/70 bg-[rgba(255,255,255,0.52)] p-5 shadow-[0_24px_40px_rgba(65,43,28,0.08)]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Spotlight
                  </p>
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-2xl font-semibold text-[var(--text)]">
                    {featuredProduct?.name ?? "Modern desk favorites"}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {featuredProduct?.description ??
                      "A practical collection of hardware that looks sharp and works hard."}
                  </p>
                </div>
                <Separator className="my-5" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Starts at
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-[var(--text)]">
                      {featuredProduct
                        ? formatCurrency(featuredProduct.price)
                        : formatCurrency(9900)}
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--text)]">
                    Limited weekly drop
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,255,255,0.75)] p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                    <p className="font-semibold text-[var(--text)]">
                      Tested checkout flow
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Shipping, order creation, and stock deduction still run
                    against the real backend transaction path.
                  </p>
                </div>
                <div className="rounded-[28px] border border-[color:var(--border)] bg-[rgba(35,29,25,0.94)] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    This week
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    Desk setup bundles
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Match screens, storage, and peripherals without spending
                    half a day comparing tabs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-[32px] border-[color:var(--border)] bg-[color:var(--surface-strong)]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Shop by category
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Find your next upgrade
                  </h3>
                </div>
                <Truck className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div className="grid gap-2">
                <Button
                  variant={!selectedCategory ? "default" : "secondary"}
                  className="justify-between"
                  onClick={() => handleCategoryChange(undefined)}
                >
                  All products
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {PRODUCT_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "secondary"
                    }
                    className="justify-between"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {CATEGORY_LABELS[category]}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-[color:var(--border)] bg-[rgba(255,255,255,0.8)]">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Today on the floor
              </p>
              <div className="space-y-2">
                <p className="text-3xl font-semibold text-[var(--text)]">
                  {pagination?.total ?? 0}
                </p>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  products across keyboards, monitors, audio, storage, and desk
                  accessories.
                </p>
              </div>
              <Separator />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Popular now
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    Monitor arms and compact boards
                  </p>
                </div>
                <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Service note
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    Friendly returns, no surprise restock fees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,252,247,0.72)] px-5 py-4 shadow-[var(--shadow)] md:px-6">
        <div className="grid gap-4 text-sm text-[var(--muted)] md:grid-cols-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
            Secure order placement backed by transactional stock updates
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-4 w-4 text-[var(--accent)]" />
            Clear shipping details saved with each order snapshot
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-[var(--accent)]" />
            Curated selection instead of a noisy warehouse catalog
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Trending now
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--text)] md:text-4xl">
              Best sellers for desks that get used every day
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            Filter by category, add products to the bag, and take the flow all
            the way through checkout.
          </p>
        </div>

        {(isLoading || isPending) && <ProductGridSkeleton />}

        {!isLoading && !isPending && error ? (
          <Card className="rounded-[30px] border-[color:var(--border)] bg-white/80">
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

            <div className="flex flex-col gap-4 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">
                  Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {pagination?.total ?? 0} products available in the current
                  catalog.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={!pagination || pagination.page <= 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((current) => current + 1)}
                  disabled={
                    !pagination || pagination.page >= pagination.totalPages
                  }
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
