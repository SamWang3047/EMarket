"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
          className="rounded-full border-[color:var(--border)] bg-white/70"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            Local state is persisted with Zustand. The checkout page posts to
            the real transactional order API.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!items.length ? (
            <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-white/60 p-8 text-center text-sm leading-6 text-[var(--muted)]">
              Your cart is empty. Add a few products and continue to checkout.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,rgba(217,187,164,0.32),rgba(255,255,255,0.84))]">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--muted)]">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
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
                    <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-2 py-1">
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
            <div className="flex items-center justify-between text-sm text-[var(--muted)]">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <Separator />
            <div className="flex gap-3">
              <Link href="/checkout" className="flex-1">
                <Button className="w-full" disabled={!items.length}>
                  Go to checkout
                </Button>
              </Link>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
