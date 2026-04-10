import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";

type ProductDetailWindowProps = {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  animationMs: number;
};

export function ProductDetailWindow({
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
        <DialogPrimitive.Content className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 outline-none">
          <div
            className="pointer-events-auto relative h-[80vh] w-[80vw] max-h-[920px] max-w-[1400px] overflow-hidden rounded-[30px] border border-[color:var(--border)] shadow-[0_45px_120px_rgba(16,14,12,0.42)]"
            style={{
              animation: `product-dialog-grow-in ${animationMs}ms cubic-bezier(0.16,1,0.3,1) both`,
              background:
                "linear-gradient(145deg,var(--surface-strong),var(--surface))"
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
                    className="shadow-none hover:brightness-95"
                    style={{
                      backgroundColor: "var(--action)",
                      color: "var(--action-contrast)"
                    }}
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

            <DialogPrimitive.Close
              className="absolute right-4 top-4 rounded-full p-2 text-[var(--muted)] transition hover:brightness-95 hover:text-[var(--text)]"
              style={{ backgroundColor: "var(--surface-strong)" }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
