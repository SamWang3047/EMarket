"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABELS } from "@/lib/constants";
import { DEMO_CUSTOMER_ID } from "@/lib/demo-user";
import { cn } from "@/lib/utils";
import {
  getCartCount,
  getCartSubtotal,
  useCartStore
} from "@/stores/cart-store";

type CheckoutFormValues = {
  fullName: string;
  shippingAddress: string;
};

function formatCurrency(priceInCents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  }).format(priceInCents / 100);
}

export function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = getCartCount(items);
  const subtotal = getCartSubtotal(items);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      fullName: "Demo Customer",
      shippingAddress: "48 Harbour Street, Sydney NSW 2000"
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          userId: DEMO_CUSTOMER_ID,
          shippingAddress: `${values.fullName} · ${values.shippingAddress}`,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      const payload = (await response.json()) as {
        success: boolean;
        error: { message: string } | null;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "Unable to place the order.");
      }

      clearCart();
      toast.success("Order placed successfully.");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to place the order."
      );
    }
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-8 px-4 py-5 md:px-8 md:py-8">
      <header className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-5 shadow-[var(--shadow)] backdrop-blur-xl md:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge>Day 5</Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
                Checkout
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Cart state is persisted locally. Orders go through the real
                inventory transaction from Day 3 using a fixed demo customer
                identity.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary">Back to storefront</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card>
          <CardContent className="space-y-5 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Cart
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                  {itemCount} item{itemCount === 1 ? "" : "s"} ready to checkout
                </h2>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)]">
                <ShoppingBag className="h-4 w-4" />
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {!items.length ? (
              <div className="rounded-[28px] border border-dashed border-[color:var(--border)] bg-white/55 p-8 text-center text-sm text-[var(--muted)]">
                Your cart is empty. Add a few products from the storefront to
                test the full checkout flow.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,rgba(217,187,164,0.32),rgba(255,255,255,0.84))]">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-[var(--muted)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                          {CATEGORY_LABELS[item.category]}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-2 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() =>
                            item.quantity === 1
                              ? removeItem(item.productId)
                              : updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
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

                      <div className="min-w-28 text-right text-sm font-semibold text-[var(--text)]">
                        {formatCurrency(item.price * item.quantity)}
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Delivery details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                Confirm order
              </h2>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-[var(--text)]"
                  htmlFor="fullName"
                >
                  Full name
                </label>
                <Input
                  id="fullName"
                  placeholder="Jane Doe"
                  {...register("fullName", {
                    required: "Full name is required."
                  })}
                />
                {errors.fullName ? (
                  <p className="text-sm text-[var(--accent-strong)]">
                    {errors.fullName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-[var(--text)]"
                  htmlFor="shippingAddress"
                >
                  Shipping address
                </label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Street, suburb, city, postcode"
                  {...register("shippingAddress", {
                    required: "Shipping address is required.",
                    minLength: {
                      value: 5,
                      message: "Shipping address is too short."
                    }
                  })}
                />
                {errors.shippingAddress ? (
                  <p className="text-sm text-[var(--accent-strong)]">
                    {errors.shippingAddress.message}
                  </p>
                ) : null}
              </div>

              <div className="rounded-[28px] border border-[color:var(--border)] bg-white/60 p-4">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Shipping</span>
                  <span>Included</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[color:var(--border)] pt-4 text-base font-semibold text-[var(--text)]">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className={cn("w-full", !items.length && "opacity-60")}
                disabled={!items.length || isSubmitting}
              >
                {isSubmitting ? "Placing order..." : "Place order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
