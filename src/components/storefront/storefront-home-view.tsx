import type { RefObject } from "react";
import { ProductImage } from "@/components/product/product-image";
import {
  HOME_FLOW_STEPS,
  HOME_METRICS,
  formatMetricValue,
  type ShowcaseProduct
} from "@/components/storefront/storefront-page-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

type ShowcaseCardProps = {
  badge: string;
  product: ShowcaseProduct;
  className: string;
  transform: string;
  opacity?: number;
};

function ShowcaseCard({
  badge,
  product,
  className,
  transform,
  opacity
}: ShowcaseCardProps) {
  return (
    <article
      className={className}
      style={{
        transform,
        opacity
      }}
    >
      <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr] md:gap-6 md:p-6">
        <div className="h-52 overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] md:h-full">
          <ProductImage
            alt={product.name}
            category={product.category}
            imageUrl={product.imageUrl}
            className="h-full w-full"
            imageClassName="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {badge}
          </p>
          <h3 className="text-3xl font-semibold text-[var(--text)]">
            {product.name}
          </h3>
          <p className="text-sm leading-7 text-[var(--muted)]">
            {product.description}
          </p>
          <p className="text-2xl font-semibold text-[var(--text)]">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
    </article>
  );
}

type StorefrontHomeViewProps = {
  showcaseRef: RefObject<HTMLElement | null>;
  metricsSectionRef: RefObject<HTMLElement | null>;
  flowSectionRef: RefObject<HTMLElement | null>;
  showcaseProducts: ShowcaseProduct[];
  cardOneTranslateY: number;
  cardTwoTranslateY: number;
  cardThreeTranslateY: number;
  cardTwoProgress: number;
  cardThreeProgress: number;
  metricValues: number[];
  activeFlowStep: number;
  isScrollCtaVisible: boolean;
  onOpenProductSection: () => void;
};

export function StorefrontHomeView({
  showcaseRef,
  metricsSectionRef,
  flowSectionRef,
  showcaseProducts,
  cardOneTranslateY,
  cardTwoTranslateY,
  cardThreeTranslateY,
  cardTwoProgress,
  cardThreeProgress,
  metricValues,
  activeFlowStep,
  isScrollCtaVisible,
  onOpenProductSection
}: StorefrontHomeViewProps) {
  return (
    <>
      <section
        ref={showcaseRef}
        className="relative mx-auto w-full max-w-[1480px] px-4 pt-6 md:px-8 md:pt-8"
      >
        <div
          className="relative h-[50vh] min-h-[420px] w-full overflow-hidden rounded-[32px] border border-[color:var(--border)] p-4 md:p-6"
          style={{
            background:
              "linear-gradient(180deg,var(--showcase-shell-bg-start),var(--showcase-shell-bg-end))"
          }}
        >
          <ShowcaseCard
            badge="Featured Item"
            product={showcaseProducts[0]}
            className="absolute left-4 right-4 top-4 z-10 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--showcase-card-bg)] shadow-[0_28px_70px_rgba(39,30,22,0.15)] transition-transform duration-100 md:left-8 md:right-8"
            transform={`translateY(${cardOneTranslateY}px) scale(1)`}
          />

          <ShowcaseCard
            badge="Next Reveal"
            product={showcaseProducts[1]}
            className="absolute left-4 right-4 top-10 z-20 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--showcase-card-bg)] shadow-[0_30px_75px_rgba(39,30,22,0.18)] transition-transform duration-100 md:left-8 md:right-8"
            transform={`translateY(${cardTwoTranslateY}px) scale(${0.985 + cardTwoProgress * 0.015})`}
            opacity={cardTwoProgress > 0 ? 1 : 0}
          />

          <ShowcaseCard
            badge="Final Layer"
            product={showcaseProducts[2]}
            className="absolute left-4 right-4 top-16 z-30 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--showcase-card-bg)] shadow-[0_32px_82px_rgba(39,30,22,0.2)] transition-transform duration-100 md:left-8 md:right-8"
            transform={`translateY(${cardThreeTranslateY}px) scale(${0.97 + cardThreeProgress * 0.03})`}
            opacity={cardThreeProgress > 0 ? 1 : 0}
          />
        </div>
      </section>

      <section
        ref={metricsSectionRef}
        data-home-reveal
        className="home-reveal mx-auto w-full max-w-[1480px] px-4 pb-6 md:px-8"
      >
        <div
          className="rounded-[32px] border border-[color:var(--border)] p-6 md:p-8"
          style={{
            background:
              "linear-gradient(160deg,var(--metrics-bg-start),var(--metrics-bg-end))"
          }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {HOME_METRICS.map((metric, index) => (
              <article
                key={metric.label}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {metric.label}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-[var(--text)] md:text-5xl">
                  {formatMetricValue(metricValues[index] ?? 0, metric)}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {metric.helper}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={flowSectionRef}
        data-home-reveal
        className="home-reveal relative mx-auto h-[220vh] w-full max-w-[1480px] px-4 pb-10 md:px-8"
      >
        <div
          className="sticky top-24 h-[calc(100vh-8rem)] overflow-hidden rounded-[32px] border border-[color:var(--border)] p-5 md:p-8"
          style={{
            background:
              "linear-gradient(180deg,var(--flow-bg-start),var(--flow-bg-end))"
          }}
        >
          <div className="grid h-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Scroll Flow
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)] md:text-5xl">
                Convert scroll intent into action.
              </h2>
              <div className="mt-8 space-y-4">
                {HOME_FLOW_STEPS.map((step, index) => (
                  <article
                    key={step.title}
                    className={cn(
                      "rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 transition-all duration-400",
                      index === activeFlowStep
                        ? "shadow-[0_14px_36px_rgba(38,27,18,0.12)]"
                        : "opacity-70"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-[2px] rounded-full bg-[var(--accent)] transition-all duration-300",
                          index === activeFlowStep ? "w-10" : "w-4 opacity-45"
                        )}
                      />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                        {step.badge}
                      </p>
                    </div>
                    <p className="mt-2 text-xl font-semibold text-[var(--text)]">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={cn(
          "pointer-events-none fixed bottom-6 right-6 z-40 transition-all duration-500",
          isScrollCtaVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0"
        )}
      >
        <Button
          className="pointer-events-auto h-12 rounded-full px-6 text-sm shadow-[0_18px_38px_rgba(14,14,14,0.26)] hover:brightness-95"
          style={{
            backgroundColor: "var(--action)",
            color: "var(--action-contrast)"
          }}
          onClick={onOpenProductSection}
        >
          Browse Products
        </Button>
      </div>
    </>
  );
}
