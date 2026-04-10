import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StorefrontView } from "@/components/storefront/storefront-page-config";

type StorefrontPlaceholderViewProps = {
  activeView: Exclude<StorefrontView, "Home" | "Product">;
  onBackToProduct: () => void;
};

export function StorefrontPlaceholderView({
  activeView,
  onBackToProduct
}: StorefrontPlaceholderViewProps) {
  return (
    <section className="mx-auto w-full max-w-[1480px] px-4 py-8 md:px-8 md:py-10">
      <Card className="rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface)]">
        <CardContent className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {activeView}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">
            Section content coming next
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Product listing has been moved under the Product top navigation item
            as requested.
          </p>
          <Button className="mt-6" onClick={onBackToProduct}>
            Back to Product
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
