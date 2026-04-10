import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
