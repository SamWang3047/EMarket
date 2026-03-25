"use client";

import { useDeferredValue, useState, useTransition } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
import { CartSheet } from "@/components/storefront/cart-sheet";
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

const PAGE_SIZE = 9;
const PRODUCT_DIALOG_ANIMATION_MS = 500;

const PRIMARY_NAV = [
  "Product",
  "Solutions",
  "Resources",
  "Wix Studio",
  "Enterprise"
] as const;

const SECONDARY_NAV = ["Start", "Sell", "Manage", "Learn", "Pricing"];

type PrimaryNavItem = (typeof PRIMARY_NAV)[number];

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
};

function ProductCard({ product, onOpen, onAdd }: ProductCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_18px_36px_rgba(40,31,20,0.06)] transition-transform duration-300 hover:-translate-y-1"
      onClick={() => onOpen(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(product);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))]">
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {CATEGORY_LABELS[product.category]}
          </span>
        </div>
        <ProductImage
          alt={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <CardContent className="space-y-3 p-5">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-[var(--text)]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {product.description ?? "Reliable gear for everyday desk setups."}
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-[var(--text)]">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {product.stock} available
            </p>
          </div>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
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
          className="overflow-hidden rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface-strong)]"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4 p-5">
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

type ProductDetailWindowProps = {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  animationMs: number;
};

function ProductDetailWindow({
  open,
  product,
  onOpenChange,
  onAdd,
  animationMs
}: ProductDetailWindowProps) {
  if (!product) {
    return null;
  }

  const estimatedTax = Math.round(product.price * 0.1);
  const total = product.price + estimatedTax;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
          style={{
            animation: `product-dialog-overlay-in ${animationMs}ms ease-out both`
          }}
        />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none pointer-events-none">
          <div
            className="pointer-events-auto relative h-[80vh] w-[80vw] max-h-[920px] max-w-[1400px] overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,233,223,0.92))] shadow-[0_45px_120px_rgba(16,14,12,0.42)]"
            style={{
              animation: `product-dialog-grow-in ${animationMs}ms cubic-bezier(0.16,1,0.3,1) both`
            }}
          >
            <div className="grid h-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative h-full min-h-[260px] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] lg:border-b-0 lg:border-r">
                <div className="absolute left-6 top-6 z-10">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </div>
                <ProductImage
                  alt={product.name}
                  category={product.category}
                  imageUrl={product.imageUrl}
                  className="h-full w-full"
                  imageClassName="h-full w-full object-cover"
                />
              </div>

              <div className="flex h-full flex-col p-6 md:p-8">
                <DialogPrimitive.Title className="text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
                  {product.name}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-4 text-base leading-7 text-[var(--muted)]">
                  {product.description ??
                    "A practical, durable product for everyday workspace use."}
                </DialogPrimitive.Description>

                <div className="mt-8 space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Base price</span>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Estimated tax (10%)</span>
                    <span>{formatCurrency(estimatedTax)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xl font-semibold text-[var(--text)]">
                    <span>Total estimate</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[var(--muted)]">
                  Current stock: {product.stock}
                </p>

                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Button
                    onClick={() => onAdd(product)}
                    disabled={product.stock <= 0}
                    size="lg"
                    className="bg-black text-white shadow-none hover:bg-black/85"
                  >
                    Add to bag
                  </Button>
                  <DialogPrimitive.Close asChild>
                    <Button size="lg" variant="secondary">
                      Close
                    </Button>
                  </DialogPrimitive.Close>
                </div>
              </div>
            </div>

            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/85 p-2 text-[var(--muted)] transition hover:bg-white hover:text-[var(--text)]">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function StorefrontPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >();
  const [activePrimaryNav, setActivePrimaryNav] =
    useState<PrimaryNavItem>("Product");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredCategory = useDeferredValue(selectedCategory);
  const addItem = useCartStore((state) => state.addItem);

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

  const handleAddToBag = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to bag.`);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const openProductSection = () => {
    setIsProductDialogOpen(false);
    setActivePrimaryNav("Product");
    handleCategoryChange(undefined);
    requestAnimationFrame(() => {
      document
        .getElementById("product-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="min-h-screen [font-family:'Avenir_Next','Helvetica_Neue','Segoe_UI',sans-serif]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-8">
            <div className="text-[36px] font-semibold leading-none tracking-[-0.06em]">
              EMarket
            </div>
            <nav className="hidden items-center gap-6 text-[15px] text-black/80 lg:flex">
              {PRIMARY_NAV.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "transition hover:text-black",
                    activePrimaryNav === item && "font-semibold text-black"
                  )}
                  onClick={() => {
                    setIsProductDialogOpen(false);
                    setActivePrimaryNav(item);
                    if (item === "Product") {
                      requestAnimationFrame(() => {
                        document
                          .getElementById("product-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                          });
                      });
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-5 text-sm md:flex">
            <Button
              className="h-10 bg-[#1664ff] px-5 text-white shadow-none hover:bg-[#0f52d9]"
              size="sm"
            >
              Log in
            </Button>
          </div>
        </div>
        <div className="border-t border-black/10">
          <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
            <p className="text-lg font-semibold tracking-[-0.02em]">
              eCommerce
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <nav className="hidden items-center gap-5 text-[15px] text-black/80 md:flex">
                {SECONDARY_NAV.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="transition hover:text-black"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-[#9bbbec]">
        <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center px-6 pb-20 pt-16 text-center md:px-10 md:pb-24 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/72 md:text-sm">
            Build an ecommerce website
          </p>
          <h1 className="mt-6 text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-black md:text-8xl">
            Sell sooner.
            <br />
            Scale without limits.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/78 md:text-[34px] md:leading-[1.4]">
            Run your storefront, manage products, and complete checkout on one
            clean flow.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 bg-black px-7 text-base text-white shadow-none hover:bg-black/85"
              onClick={openProductSection}
            >
              View Products
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 border-black/20 bg-white/85 px-7 text-base text-black hover:bg-white"
            >
              <Link href="/checkout">Go to Checkout</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-black/66">
            {pagination?.total ?? 0} products ready to browse.
          </p>
        </div>
      </section>

      {activePrimaryNav === "Product" ? (
        <section
          id="product-section"
          className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-8 md:px-8 md:py-10"
        >
          <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,252,247,0.74)] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Catalog
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)] md:text-3xl">
                {selectedCategory
                  ? CATEGORY_LABELS[selectedCategory]
                  : "All products"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "secondary"}
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
                  onClick={() => handleCategoryChange(category)}
                >
                  {CATEGORY_LABELS[category]}
                </Button>
              ))}
            </div>
          </div>

          {(isLoading || isPending) && <ProductGridSkeleton />}

          {!isLoading && !isPending && error ? (
            <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
              <CardContent className="p-6 text-sm text-[var(--muted)]">
                Failed to load products. {error.message}
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && !isPending && !error ? (
            <>
              {products.length === 0 ? (
                <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
                  <CardContent className="p-6 text-sm text-[var(--muted)]">
                    No products found for this category.
                  </CardContent>
                </Card>
              ) : null}

              <div
                className={cn(
                  "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
                  isFetching && "opacity-70 transition-opacity"
                )}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProductDetail}
                    onAdd={handleAddToBag}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Page {pagination?.page ?? 1} of{" "}
                    {pagination?.totalPages ?? 1}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {pagination?.total ?? 0} products in current catalog.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
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
      ) : (
        <section className="mx-auto w-full max-w-[1480px] px-4 py-8 md:px-8 md:py-10">
          <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
            <CardContent className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {activePrimaryNav}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">
                Section content coming next
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Product listing has been moved under the Product top navigation
                item as requested.
              </p>
              <Button className="mt-6" onClick={openProductSection}>
                Back to Product
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <ProductDetailWindow
        open={isProductDialogOpen}
        product={selectedProduct}
        onOpenChange={setIsProductDialogOpen}
        onAdd={handleAddToBag}
        animationMs={PRODUCT_DIALOG_ANIMATION_MS}
      />
    </main>
  );
}
