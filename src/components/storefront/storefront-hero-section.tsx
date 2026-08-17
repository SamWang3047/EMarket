import type { RefObject } from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import type { ShowcaseProduct } from "@/components/storefront/storefront-page-config";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

type StorefrontHeroSectionProps = {
  sectionRef: RefObject<HTMLElement | null>;
  product: ShowcaseProduct;
  totalProducts: number;
  scrollProgress: number;
  onOpenProductSection: () => void;
  onExploreCollection: () => void;
};

export function StorefrontHeroSection({
  sectionRef,
  product,
  totalProducts,
  scrollProgress,
  onOpenProductSection,
  onExploreCollection
}: StorefrontHeroSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-[var(--canvas)]"
    >
      <div className="mx-auto grid min-h-[calc(100svh-72px)] w-full max-w-[1440px] items-center gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-14">
        <div
          className="relative z-10 max-w-[640px]"
          style={{
            opacity: 1 - scrollProgress * 0.64,
            transform: `translateY(${-38 * scrollProgress}px)`
          }}
        >
          <p className="mb-8 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--signal)] ring-4 ring-[rgba(223,255,88,0.2)]" />
            Workspace essentials · Sydney
          </p>

          <h1 className="text-[clamp(4.2rem,8vw,8.5rem)] font-medium leading-[0.84] tracking-[-0.075em] text-[var(--text)]">
            <span className="hero-line">
              <span>Less noise.</span>
            </span>
            <span className="hero-line text-[var(--accent)]">
              <span>Better work.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[520px] text-lg leading-8 text-[var(--muted)] md:text-xl">
            Thoughtful tools for a calmer desk, a sharper mind, and work that
            feels more like your own.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={onOpenProductSection}
              className="h-12 bg-[var(--action)] px-6 text-white shadow-none hover:bg-[var(--action-hover)]"
            >
              Shop the collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={onExploreCollection}
              className="h-12 px-5 text-[var(--text)]"
            >
              Explore the edit
              <ArrowDownRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-8 text-sm text-[var(--muted)]">
            {totalProducts > 0
              ? `${totalProducts} essentials, carefully selected.`
              : "A focused edit of everyday desk essentials."}
          </p>
        </div>

        <div className="hero-media-in relative min-h-[520px] lg:h-[min(76vh,850px)]">
          <div
            className="absolute inset-0 overflow-hidden rounded-[24px] bg-[#dadbd2]"
            style={{
              transform: `scale(${1 + scrollProgress * 0.055}) translateY(${scrollProgress * 14}px)`
            }}
          >
            <ProductImage
              alt={product.name}
              category={product.category}
              imageUrl={product.imageUrl}
              className="h-full w-full"
              imageClassName="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(10,15,11,0.72)_100%)]" />
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-5 rounded-[16px] border border-white/20 bg-black/20 p-4 text-white backdrop-blur-md md:bottom-7 md:left-7 md:right-7 md:p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
                Today&apos;s edit
              </p>
              <p className="mt-1.5 text-lg font-medium tracking-[-0.02em] md:text-xl">
                {product.name}
              </p>
            </div>
            <p className="shrink-0 text-lg font-medium">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="absolute -right-2 top-10 hidden h-28 w-28 rotate-6 items-center justify-center rounded-full bg-[var(--signal)] text-center text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-[var(--text)] shadow-[0_18px_50px_rgba(72,83,29,0.2)] md:flex">
            Made for
            <br />
            the everyday
          </div>
        </div>
      </div>
    </section>
  );
}
