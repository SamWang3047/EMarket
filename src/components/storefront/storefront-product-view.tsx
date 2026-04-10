import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGridSkeleton } from "@/components/storefront/storefront-product-grid-skeleton";
import { ProductCard } from "@/components/storefront/storefront-product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PRODUCT_CATEGORIES,
  CATEGORY_LABELS,
  type ProductCategory
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Product, ProductsResponse } from "@/types/product";

type StorefrontProductViewProps = {
  selectedCategory?: ProductCategory;
  onCategoryChange: (category?: ProductCategory) => void;
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  products: Product[];
  pagination?: ProductsResponse["pagination"];
  onOpenProductDetail: (product: Product) => void;
  onAddToBag: (product: Product) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function StorefrontProductView({
  selectedCategory,
  onCategoryChange,
  isLoading,
  isPending,
  isFetching,
  error,
  products,
  pagination,
  onOpenProductDetail,
  onAddToBag,
  onPreviousPage,
  onNextPage
}: StorefrontProductViewProps) {
  return (
    <section
      id="product-section"
      className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-8 md:px-8 md:py-10"
    >
      <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 md:flex-row md:items-center md:justify-between">
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
            onClick={() => onCategoryChange(undefined)}
          >
            All
          </Button>
          {PRODUCT_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              onClick={() => onCategoryChange(category)}
            >
              {CATEGORY_LABELS[category]}
            </Button>
          ))}
        </div>
      </div>

      {(isLoading || isPending) && <ProductGridSkeleton />}

      {!isLoading && !isPending && error ? (
        <Card className="rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardContent className="p-6 text-sm text-[var(--muted)]">
            Failed to load products. {error.message}
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isPending && !error ? (
        <>
          {products.length === 0 ? (
            <Card className="rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface)]">
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
                onOpen={onOpenProductDetail}
                onAdd={onAddToBag}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">
                Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {pagination?.total ?? 0} products in current catalog.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={onPreviousPage}
                disabled={!pagination || pagination.page <= 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={onNextPage}
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
  );
}
