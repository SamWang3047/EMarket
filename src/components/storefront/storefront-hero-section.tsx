import Link from "next/link";
import { Button } from "@/components/ui/button";

type StorefrontHeroSectionProps = {
  totalProducts: number;
  onOpenProductSection: () => void;
};

export function StorefrontHeroSection({
  totalProducts,
  onOpenProductSection
}: StorefrontHeroSectionProps) {
  return (
    <section className="bg-[color:var(--hero-bg)] transition-colors">
      <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center px-6 pb-20 pt-16 text-center md:px-10 md:pb-24 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--hero-muted)] md:text-sm">
          Build an ecommerce website
        </p>
        <h1 className="mt-6 text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-[color:var(--hero-text)] md:text-8xl">
          Sell sooner.
          <br />
          Scale without limits.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[color:var(--hero-muted)] md:text-[34px] md:leading-[1.4]">
          Run your storefront, manage products, and complete checkout on one
          clean flow.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="h-12 px-7 text-base shadow-none hover:brightness-95"
            style={{
              backgroundColor: "var(--action)",
              color: "var(--action-contrast)"
            }}
            onClick={onOpenProductSection}
          >
            View Products
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-12 border-[color:var(--border)] bg-[color:var(--surface-strong)] px-7 text-base text-[var(--text)] hover:brightness-95"
          >
            <Link href="/checkout">Go to Checkout</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-[color:var(--hero-muted)]">
          {totalProducts} products ready to browse.
        </p>
      </div>
    </section>
  );
}
