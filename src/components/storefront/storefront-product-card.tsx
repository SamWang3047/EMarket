import { Plus } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onOpen, onAdd }: ProductCardProps) {
  return (
    <article className="group">
      <button
        type="button"
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#dedfd7] text-left"
        onClick={() => onOpen(product)}
        aria-label={`View ${product.name}`}
      >
        <ProductImage
          alt={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          className="h-full w-full"
          imageClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text)] backdrop-blur-md">
          {CATEGORY_LABELS[product.category]}
        </span>
      </button>

      <div className="mt-4 flex items-start justify-between gap-4">
        <button
          type="button"
          className="min-w-0 text-left"
          onClick={() => onOpen(product)}
        >
          <h3 className="truncate text-base font-medium tracking-[-0.02em] text-[var(--text)]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {formatCurrency(product.price)}
          </p>
        </button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-10 w-10 shrink-0 rounded-full p-0"
          onClick={() => onAdd(product)}
          disabled={product.stock <= 0}
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
