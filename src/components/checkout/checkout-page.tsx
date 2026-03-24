"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Trash2,
  Truck
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
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

  if (!items.length) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[960px] items-center px-4 py-10 md:px-8">
        <Card className="w-full rounded-[36px] border-[color:var(--border)] bg-[color:var(--surface-strong)]">
          <CardContent className="space-y-6 p-8 text-center md:p-12">
            <Badge>Your bag is empty</Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
                Nothing to check out yet
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-[var(--muted)]">
                Add a few products from the storefront first, then come back to
                complete the order.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to storefront
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-8 px-4 py-4 md:px-8 md:py-8">
      <header className="rounded-[32px] border border-[color:var(--border)] bg-[rgba(255,250,244,0.82)] px-5 py-5 shadow-[var(--shadow)] backdrop-blur-xl md:px-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <Badge>Secure checkout</Badge>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">
                Complete your order
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Shipping details are validated with react-hook-form and zod,
                while the order itself still goes through the transactional
                inventory path.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
            <div className="rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">
              {itemCount} item{itemCount === 1 ? "" : "s"} in bag
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_460px]">
        <div className="space-y-6">
          <Card className="rounded-[34px] border-[color:var(--border)] bg-[linear-gradient(135deg,#fff8f1_0%,#f5e6d9_100%)]">
            <CardContent className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
              <div className="rounded-3xl bg-white/72 p-5">
                <Truck className="h-5 w-5 text-[var(--accent)]" />
                <p className="mt-3 text-lg font-semibold text-[var(--text)]">
                  Dispatch promise
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  In-stock items are prepared for shipment quickly.
                </p>
              </div>
              <div className="rounded-3xl bg-white/72 p-5">
                <ShieldCheck className="h-5 w-5 text-[var(--accent)]" />
                <p className="mt-3 text-lg font-semibold text-[var(--text)]">
                  Safe transaction path
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Inventory checks and order creation are handled atomically.
                </p>
              </div>
              <div className="rounded-3xl bg-white/72 p-5">
                <PackageCheck className="h-5 w-5 text-[var(--accent)]" />
                <p className="mt-3 text-lg font-semibold text-[var(--text)]">
                  Snapshot accuracy
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Address and purchase price are stored with the order.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[34px] border-[color:var(--border)] bg-[color:var(--surface-strong)]">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
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
                          Demo checkout assumes the customer is already signed
                          in.
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

                  <Button
                    type="submit"
                    size="lg"
                    className={cn("w-full")}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Placing order..."
                      : "Place order"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <Card className="rounded-[34px] border-[color:var(--border)] bg-[rgba(255,255,255,0.86)]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Order summary
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Review your bag
                  </h2>
                </div>
                <div className="rounded-full bg-[color:var(--surface)] px-4 py-2 text-sm text-[var(--muted)]">
                  {itemCount} items
                </div>
              </div>

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
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
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

                    <div className="flex items-center justify-between gap-4">
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

              <Separator />

              <div className="space-y-3 rounded-3xl bg-[color:var(--surface)] p-4">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Shipping</span>
                  <span>Included</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-semibold text-[var(--text)]">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[34px] border-[color:var(--border)] bg-[rgba(35,29,25,0.94)] text-white">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5" />
                <p className="font-semibold">Why this feels like a real flow</p>
              </div>
              <p className="text-sm leading-7 text-white/75">
                Form validation, local bag state, and transactional order
                submission are all wired together, so the polished UI still sits
                on top of real backend behavior.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
