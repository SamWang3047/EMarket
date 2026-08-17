import type { RefObject } from "react";
import { ArrowRight, MoveUpRight } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import {
  HOME_FLOW_STEPS,
  HOME_METRICS,
  formatMetricValue,
  type ShowcaseProduct
} from "@/components/storefront/storefront-page-config";
import { ProductCard } from "@/components/storefront/storefront-product-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type EditorialCardProps = {
  product: ShowcaseProduct;
  index: number;
  onOpenProductSection: () => void;
};

function EditorialCard({
  product,
  index,
  onOpenProductSection
}: EditorialCardProps) {
  const isLead = index === 0;

  return (
    <button
      type="button"
      className={cn(
        "group relative w-full overflow-hidden rounded-[20px] bg-[#dfe0d8] text-left",
        isLead
          ? "min-h-[540px] lg:row-span-2 lg:min-h-[680px]"
          : "min-h-[320px] lg:min-h-0"
      )}
      onClick={onOpenProductSection}
    >
      <ProductImage
        alt={product.name}
        category={product.category}
        imageUrl={product.imageUrl}
        className="absolute inset-0 h-full w-full"
        imageClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(12,16,13,0.78)_100%)]" />
      <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/15 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
        0{index + 1}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-5 text-white md:p-7">
        <div>
          <p className="text-xl font-medium tracking-[-0.025em] md:text-2xl">
            {product.name}
          </p>
          <p className="mt-1.5 text-sm text-white/70">
            {formatCurrency(product.price)}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--text)] transition-transform duration-300 group-hover:rotate-12">
          <MoveUpRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}

type StorefrontHomeViewProps = {
  metricsSectionRef: RefObject<HTMLElement | null>;
  storySectionRef: RefObject<HTMLElement | null>;
  showcaseProducts: ShowcaseProduct[];
  products: Product[];
  isLoading: boolean;
  metricValues: number[];
  activeStoryStep: number;
  storyProgress: number;
  isScrollCtaVisible: boolean;
  onOpenProductSection: () => void;
  onOpenProductDetail: (product: Product) => void;
  onAddToBag: (product: Product) => void;
};

export function StorefrontHomeView({
  metricsSectionRef,
  storySectionRef,
  showcaseProducts,
  products,
  isLoading,
  metricValues,
  activeStoryStep,
  storyProgress,
  isScrollCtaVisible,
  onOpenProductSection,
  onOpenProductDetail,
  onAddToBag
}: StorefrontHomeViewProps) {
  return (
    <>
      <section
        id="collection-section"
        data-home-reveal
        className="home-reveal bg-[var(--bg)] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                The EMarket edit
              </p>
              <h2 className="mt-4 max-w-[760px] text-4xl font-medium leading-[1.02] tracking-[-0.055em] md:text-6xl lg:text-7xl">
                A calmer desk starts with better tools.
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={onOpenProductSection}
              className="w-fit px-0 text-[var(--text)] hover:bg-transparent"
            >
              View everything
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:grid-rows-2">
            {showcaseProducts.map((product, index) => (
              <EditorialCard
                key={`${product.name}-${index}`}
                product={product}
                index={index}
                onOpenProductSection={onOpenProductSection}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="story-section"
        ref={storySectionRef}
        className="relative bg-[#151a16] text-white lg:h-[240vh]"
      >
        <div className="mx-auto hidden h-[calc(100vh-72px)] max-w-[1440px] grid-cols-[0.8fr_1.2fr] gap-16 px-8 py-10 lg:sticky lg:top-[72px] lg:grid">
          <div className="flex min-h-0 flex-col py-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
              <span>Our approach</span>
              <span>
                0{activeStoryStep + 1} / 0{HOME_FLOW_STEPS.length}
              </span>
            </div>

            <div className="relative flex-1">
              {HOME_FLOW_STEPS.map((step, index) => (
                <article
                  key={step.title}
                  aria-hidden={index !== activeStoryStep}
                  className={cn(
                    "absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out",
                    index === activeStoryStep
                      ? "translate-y-0 opacity-100"
                      : index < activeStoryStep
                        ? "-translate-y-8 opacity-0"
                        : "translate-y-8 opacity-0"
                  )}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--signal)]">
                    {step.badge}
                  </p>
                  <h2 className="mt-5 max-w-[560px] text-6xl font-medium leading-[0.96] tracking-[-0.055em] xl:text-7xl">
                    {step.title}
                  </h2>
                  <p className="mt-6 max-w-[480px] text-lg leading-8 text-white/60">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="h-[2px] overflow-hidden bg-white/15">
              <div
                className="h-full origin-left bg-[var(--signal)]"
                style={{ transform: `scaleX(${storyProgress})` }}
              />
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden rounded-[24px] bg-[#30372f]">
            {showcaseProducts.map((product, index) => (
              <div
                key={`${product.name}-story`}
                aria-hidden={index !== activeStoryStep}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  index === activeStoryStep
                    ? "scale-100 opacity-100"
                    : "scale-[1.035] opacity-0"
                )}
              >
                <ProductImage
                  alt={product.name}
                  category={product.category}
                  imageUrl={product.imageUrl}
                  className="h-full w-full"
                  imageClassName="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_65%,rgba(9,12,10,0.7)_100%)]" />
                <p className="absolute bottom-7 left-7 text-sm text-white/75">
                  {product.name} · {formatCurrency(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-16 px-5 py-24 lg:hidden">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--signal)]">
              Our approach
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-none tracking-[-0.05em]">
              Space to think. Tools that work.
            </h2>
          </div>
          {HOME_FLOW_STEPS.map((step, index) => {
            const product = showcaseProducts[index];
            return (
              <article key={`${step.title}-mobile`} className="space-y-6">
                <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-[#30372f]">
                  <ProductImage
                    alt={product.name}
                    category={product.category}
                    imageUrl={product.imageUrl}
                    className="h-full w-full"
                    imageClassName="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--signal)]">
                    {step.badge}
                  </p>
                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-white/60">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        ref={metricsSectionRef}
        data-home-reveal
        className="home-reveal bg-[var(--canvas)] px-5 py-20 md:px-8 md:py-24"
      >
        <div className="mx-auto grid w-full max-w-[1320px] divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {HOME_METRICS.map((metric, index) => (
            <article key={metric.label} className="px-0 py-9 md:px-8 md:py-12">
              <p className="text-5xl font-medium tracking-[-0.055em] md:text-6xl">
                {formatMetricValue(metricValues[index] ?? 0, metric)}
              </p>
              <p className="mt-4 text-sm font-medium text-[var(--text)]">
                {metric.label}
              </p>
              <p className="mt-1.5 max-w-[280px] text-sm leading-6 text-[var(--muted)]">
                {metric.helper}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="product-preview"
        data-home-reveal
        className="home-reveal bg-[var(--canvas)] px-5 pb-28 pt-16 md:px-8 md:pb-36"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
                Shop the collection
              </p>
              <h2 className="mt-3 text-4xl font-medium tracking-[-0.05em] md:text-5xl">
                Useful by design.
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={onOpenProductSection}
              className="hidden px-0 text-[var(--text)] hover:bg-transparent sm:inline-flex"
            >
              All products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-[18px] bg-black/5" />
                  <div className="mt-4 h-5 w-2/3 rounded bg-black/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={onOpenProductDetail}
                  onAdd={onAddToBag}
                />
              ))}
            </div>
          )}

          <Button
            onClick={onOpenProductSection}
            className="mt-10 w-full bg-[var(--action)] text-white shadow-none sm:hidden"
          >
            View all products
          </Button>
        </div>
      </section>

      <section className="bg-[var(--canvas)] px-5 pb-5 md:px-8 md:pb-8">
        <div className="mx-auto flex min-h-[440px] w-full max-w-[1390px] flex-col items-center justify-center rounded-[24px] bg-[var(--accent)] px-6 py-20 text-center text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
            Your desk, reconsidered
          </p>
          <h2 className="mt-5 max-w-[860px] text-5xl font-medium leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Make room for better work.
          </h2>
          <Button
            size="lg"
            onClick={onOpenProductSection}
            className="mt-8 h-12 bg-[var(--signal)] px-6 text-[var(--text)] shadow-none hover:bg-[#e7ff7d]"
          >
            Shop the collection
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <div
        className={cn(
          "pointer-events-none fixed bottom-7 right-7 z-40 hidden transition-all duration-500 md:block",
          isScrollCtaVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0"
        )}
      >
        <Button
          className="pointer-events-auto h-12 bg-[var(--action)] px-5 text-white shadow-[0_18px_48px_rgba(14,18,15,0.24)] hover:bg-[var(--action-hover)]"
          onClick={onOpenProductSection}
        >
          Shop now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
