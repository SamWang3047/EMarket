"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import {
  getCartCount,
  getCartSubtotal,
  useCartStore
} from "@/stores/cart-store";

export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const itemCount = getCartCount(items);
  const subtotal = getCartSubtotal(items);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full border-[color:var(--border)] bg-[color:var(--surface-strong)]"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Bag ({itemCount})
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your bag</SheetTitle>
          <SheetDescription>
            Adjust quantities here, then move straight into checkout.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!items.length ? (
            <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center text-sm leading-6 text-[var(--muted)]">
              Your bag is empty. Pick a few desk essentials and they will show
              up here instantly.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(217,187,164,0.32),rgba(255,255,255,0.84))]">
                      <ProductImage
                        alt={item.name}
                        category={item.category}
                        imageUrl={item.imageUrl}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                        {CATEGORY_LABELS[item.category]}
                      </p>
                      <h3 className="mt-2 truncate text-base font-semibold text-[var(--text)]">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-2 py-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.productId)
                            : updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-8 text-center text-sm font-medium text-[var(--text)]">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-sm font-semibold text-[var(--text)]">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="w-full space-y-4">
            <div className="rounded-2xl bg-[color:var(--surface-strong)] p-4">
              <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base font-semibold text-[var(--text)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Separator />
            <Button asChild className="w-full" disabled={!items.length}>
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
