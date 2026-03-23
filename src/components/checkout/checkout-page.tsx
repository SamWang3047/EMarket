"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABELS } from "@/lib/constants";
import { DEMO_CUSTOMER_ID } from "@/lib/demo-user";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getCartCount,
  getCartSubtotal,
  useCartStore
} from "@/stores/cart-store";

const checkoutFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  shippingAddress: z.string().trim().min(8, "Shipping address is too short.")
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = getCartCount(items);
  const subtotal = getCartSubtotal(items);
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "Demo Customer",
      shippingAddress: "48 Harbour Street, Sydney NSW 2000"
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
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
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-8 px-4 py-5 md:px-8 md:py-8">
      <header className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-5 shadow-[var(--shadow)] backdrop-blur-xl md:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge>Checkout</Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
                Confirm order
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                The form is wired through react-hook-form and zod, while the
                backend still owns transactional inventory safety.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary">Back to storefront</Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card className="border-[color:var(--border)] bg-white/80">
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
              <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-[var(--muted)]">
                <ShoppingBag className="h-4 w-4" />
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {!items.length ? (
              <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-white/55 p-8 text-center text-sm leading-6 text-[var(--muted)]">
                Your cart is empty. Add products from the storefront to test the
                complete checkout flow.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4"
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
                        <h3 className="mt-2 truncate text-lg font-semibold text-[var(--text)]">
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

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-2 py-1">
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
                      <div className="text-sm font-semibold text-[var(--text)]">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[color:var(--border)] bg-[color:var(--surface-strong)]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Delivery details
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                Shipping information
              </h2>
            </div>

            <Form {...form}>
              <form className="space-y-5" onSubmit={onSubmit}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormDescription>
                        Demo checkout assumes the user is already authenticated.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Street, suburb, city, postcode"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The address is saved on the order as a purchase-time
                        snapshot.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-3xl border border-[color:var(--border)] bg-white/70 p-4">
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Shipping</span>
                    <span>Included</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-base font-semibold text-[var(--text)]">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={cn("w-full", !items.length && "opacity-60")}
                  disabled={!items.length || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Placing order..."
                    : "Place order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
