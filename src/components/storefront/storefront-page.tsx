"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product/product-image";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  type ProductCategory
} from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { useProducts } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

const PAGE_SIZE = 9;
const PRODUCT_DIALOG_ANIMATION_MS = 500;
const SHOWCASE_TRIGGER_VIEWPORT_RATIO = 0.82;
const SHOWCASE_WHEEL_SENSITIVITY = 0.0012;
const SHOWCASE_WHEEL_MAX_STEP = 0.08;
const HOME_SCROLL_CTA_RATIO = 0.55;
const HOME_METRIC_DURATION_MS = 1100;

const PRIMARY_NAV = [
  "Product",
  "Solutions",
  "Resources",
  "Wix Studio",
  "Enterprise"
] as const;

const SECONDARY_NAV = ["Start", "Sell", "Manage", "Learn", "Pricing"];

type PrimaryNavItem = (typeof PRIMARY_NAV)[number];
type StorefrontView = "Home" | PrimaryNavItem;
type ShowcaseProduct = Pick<
  Product,
  "name" | "description" | "price" | "category" | "imageUrl"
>;
type HomeMetric = {
  label: string;
  helper: string;
  suffix: string;
  target: number;
  decimals?: number;
};

const HOME_METRICS: HomeMetric[] = [
  {
    label: "Checkout Conversion",
    helper: "Average uplift after cleaner PDP flow",
    suffix: "%",
    target: 37
  },
  {
    label: "Cart Recovery",
    helper: "Triggered by smart follow-up nudges",
    suffix: "%",
    target: 18
  },
  {
    label: "Time To Publish",
    helper: "From product draft to live catalog",
    suffix: " min",
    target: 12
  }
];

const HOME_FLOW_STEPS = [
  {
    badge: "Step 01",
    title: "Launch your hero product first",
    description:
      "Pin one primary offer and make the value obvious in the first scroll."
  },
  {
    badge: "Step 02",
    title: "Stack social proof right below",
    description:
      "Surface real results and high-intent testimonials while attention is still hot."
  },
  {
    badge: "Step 03",
    title: "Close with a compact action block",
    description: "End the page with one strong action and zero decision noise."
  }
] as const;

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
  onAdd: (product: Product) => void;
};

function ProductCard({ product, onOpen, onAdd }: ProductCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_18px_36px_rgba(40,31,20,0.06)] transition-transform duration-300 hover:-translate-y-1"
      onClick={() => onOpen(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(product);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))]">
        <div className="absolute left-4 top-4 z-10">
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {CATEGORY_LABELS[product.category]}
          </span>
        </div>
        <ProductImage
          alt={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <CardContent className="space-y-3 p-5">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-[var(--text)]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {product.description ?? "Reliable gear for everyday desk setups."}
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-[var(--text)]">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {product.stock} available
            </p>
          </div>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onAdd(product);
            }}
            disabled={product.stock <= 0}
          >
            Add to bag
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden rounded-[28px] border-[color:var(--border)] bg-[color:var(--surface-strong)]"
        >
          <Skeleton className="aspect-[4/3] rounded-none" />
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Separator />
            <div className="flex items-center justify-between">
              <Skeleton className="h-14 w-28" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type ProductDetailWindowProps = {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  animationMs: number;
};

function ProductDetailWindow({
  open,
  product,
  onOpenChange,
  onAdd,
  animationMs
}: ProductDetailWindowProps) {
  if (!product) {
    return null;
  }

  const estimatedTax = Math.round(product.price * 0.1);
  const total = product.price + estimatedTax;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
          style={{
            animation: `product-dialog-overlay-in ${animationMs}ms ease-out both`
          }}
        />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none pointer-events-none">
          <div
            className="pointer-events-auto relative h-[80vh] w-[80vw] max-h-[920px] max-w-[1400px] overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(245,233,223,0.92))] shadow-[0_45px_120px_rgba(16,14,12,0.42)]"
            style={{
              animation: `product-dialog-grow-in ${animationMs}ms cubic-bezier(0.16,1,0.3,1) both`
            }}
          >
            <div className="grid h-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative h-full min-h-[260px] overflow-hidden border-b border-[color:var(--border)] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] lg:border-b-0 lg:border-r">
                <div className="absolute left-6 top-6 z-10">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                </div>
                <ProductImage
                  alt={product.name}
                  category={product.category}
                  imageUrl={product.imageUrl}
                  className="h-full w-full"
                  imageClassName="h-full w-full object-cover"
                />
              </div>

              <div className="flex h-full flex-col p-6 md:p-8">
                <DialogPrimitive.Title className="text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
                  {product.name}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-4 text-base leading-7 text-[var(--muted)]">
                  {product.description ??
                    "A practical, durable product for everyday workspace use."}
                </DialogPrimitive.Description>

                <div className="mt-8 space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Base price</span>
                    <span>{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Estimated tax (10%)</span>
                    <span>{formatCurrency(estimatedTax)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xl font-semibold text-[var(--text)]">
                    <span>Total estimate</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[var(--muted)]">
                  Current stock: {product.stock}
                </p>

                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <Button
                    onClick={() => onAdd(product)}
                    disabled={product.stock <= 0}
                    size="lg"
                    className="bg-black text-white shadow-none hover:bg-black/85"
                  >
                    Add to bag
                  </Button>
                  <DialogPrimitive.Close asChild>
                    <Button size="lg" variant="secondary">
                      Close
                    </Button>
                  </DialogPrimitive.Close>
                </div>
              </div>
            </div>

            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/85 p-2 text-[var(--muted)] transition hover:bg-white hover:text-[var(--text)]">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function StorefrontPage() {
  const showcaseRef = useRef<HTMLElement | null>(null);
  const metricsSectionRef = useRef<HTMLElement | null>(null);
  const flowSectionRef = useRef<HTMLElement | null>(null);
  const showcaseProgressRef = useRef(0);
  const showcaseDirectionRef = useRef<"forward" | "reverse">("forward");
  const metricsRafRef = useRef<number | null>(null);
  const metricsStartedRef = useRef(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | undefined
  >();
  const [activeView, setActiveView] = useState<StorefrontView>("Home");
  const [showcaseProgress, setShowcaseProgress] = useState(0);
  const [metricValues, setMetricValues] = useState(() =>
    HOME_METRICS.map(() => 0)
  );
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [flowProgress, setFlowProgress] = useState(0);
  const [isScrollCtaVisible, setIsScrollCtaVisible] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const deferredCategory = useDeferredValue(selectedCategory);
  const addItem = useCartStore((state) => state.addItem);

  const { data, isLoading, isFetching, error } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    category: deferredCategory
  });

  const products = useMemo(() => data?.items ?? [], [data]);
  const pagination = data?.pagination;
  const showcaseProducts = useMemo<ShowcaseProduct[]>(() => {
    const fallbackProducts: ShowcaseProduct[] = [
      {
        name: "Creator Desk Bundle",
        description:
          "A practical starter stack with keyboard, monitor, and audio essentials.",
        price: 28900,
        category: "DESK_SETUP",
        imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094"
      },
      {
        name: "Focus Audio Kit",
        description:
          "Closed-back headphones and desk mic combo for deep work and clear calls.",
        price: 16900,
        category: "AUDIO",
        imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b"
      },
      {
        name: "Ultra Productivity Display",
        description:
          "A color-accurate display tuned for long work sessions and clean typography.",
        price: 31900,
        category: "MONITORS",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
      }
    ];

    if (!products.length) {
      return fallbackProducts;
    }

    const selected = products.slice(0, 3).map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl
    }));

    while (selected.length < 3) {
      selected.push(fallbackProducts[selected.length]);
    }

    return selected;
  }, [products]);

  const handleCategoryChange = (category?: ProductCategory) => {
    startTransition(() => {
      setSelectedCategory(category);
      setPage(1);
    });
  };

  const handleAddToBag = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to bag.`);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const openProductSection = () => {
    setIsProductDialogOpen(false);
    setActiveView("Product");
    handleCategoryChange(undefined);
    requestAnimationFrame(() => {
      document
        .getElementById("product-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const openHome = () => {
    setIsProductDialogOpen(false);
    setActiveView("Home");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (activeView !== "Home" || isProductDialogOpen) {
        return;
      }

      const directionState = showcaseDirectionRef.current;

      const section = showcaseRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const triggerLine = window.innerHeight * SHOWCASE_TRIGGER_VIEWPORT_RATIO;
      const inTriggerRange =
        rect.top <= triggerLine && rect.bottom >= window.innerHeight * 0.35;

      if (!inTriggerRange) {
        return;
      }

      const direction = Math.sign(event.deltaY);

      if (direction === 0) {
        return;
      }

      const current = showcaseProgressRef.current;
      const step = Math.min(
        Math.abs(event.deltaY) * SHOWCASE_WHEEL_SENSITIVITY,
        SHOWCASE_WHEEL_MAX_STEP
      );
      const next =
        direction > 0
          ? Math.min(1, current + step)
          : Math.max(0, current - step);
      const shouldLockScroll =
        (directionState === "forward" && direction > 0 && current < 1) ||
        (directionState === "reverse" && direction < 0 && current > 0);

      if (!shouldLockScroll) {
        return;
      }

      event.preventDefault();
      showcaseProgressRef.current = next;
      setShowcaseProgress(next);

      if (directionState === "forward" && next >= 1) {
        showcaseDirectionRef.current = "reverse";
      }

      if (directionState === "reverse" && next <= 0) {
        showcaseDirectionRef.current = "forward";
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [activeView, isProductDialogOpen]);

  useEffect(() => {
    return () => {
      if (metricsRafRef.current !== null) {
        cancelAnimationFrame(metricsRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeView !== "Home") {
      return;
    }

    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-reveal]")
    );

    if (!revealNodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2
      }
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "Home") {
      return;
    }

    const section = metricsSectionRef.current;

    if (!section || metricsStartedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || metricsStartedRef.current) {
          return;
        }

        metricsStartedRef.current = true;
        const startTime = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - startTime) / HOME_METRIC_DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          setMetricValues(
            HOME_METRICS.map((metric) => {
              const raw = metric.target * eased;

              if (metric.decimals && metric.decimals > 0) {
                return Number(raw.toFixed(metric.decimals));
              }

              return Math.round(raw);
            })
          );

          if (t < 1) {
            metricsRafRef.current = window.requestAnimationFrame(tick);
          } else {
            setMetricValues(
              HOME_METRICS.map((metric) =>
                metric.decimals && metric.decimals > 0
                  ? Number(metric.target.toFixed(metric.decimals))
                  : metric.target
              )
            );
            metricsRafRef.current = null;
          }
        };

        metricsRafRef.current = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  useEffect(() => {
    if (activeView !== "Home") {
      setIsScrollCtaVisible(false);
      setFlowProgress(0);
      setActiveFlowStep(0);
      return;
    }

    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - doc.clientHeight, 1);
      const scrollTop = window.scrollY;
      const depth = scrollTop / max;
      const shouldShowCta = depth >= HOME_SCROLL_CTA_RATIO;

      setIsScrollCtaVisible((current) =>
        current === shouldShowCta ? current : shouldShowCta
      );

      const flowSection = flowSectionRef.current;
      if (!flowSection) {
        return;
      }

      const rect = flowSection.getBoundingClientRect();
      const start = window.innerHeight * 0.82;
      const end = window.innerHeight * 0.2;
      const travel = Math.max(flowSection.offsetHeight + (start - end), 1);
      const progress = Math.min(Math.max((start - rect.top) / travel, 0), 1);
      const nextStep = Math.min(
        HOME_FLOW_STEPS.length - 1,
        Math.floor(progress * HOME_FLOW_STEPS.length)
      );

      setFlowProgress((current) =>
        Math.abs(current - progress) < 0.002 ? current : progress
      );
      setActiveFlowStep((current) =>
        current === nextStep ? current : nextStep
      );
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeView]);

  const getRangeProgress = (value: number, start: number, end: number) => {
    if (end <= start) {
      return 1;
    }

    return Math.min(Math.max((value - start) / (end - start), 0), 1);
  };

  const cardOneProgress = getRangeProgress(showcaseProgress, 0.0, 0.2);
  const cardTwoProgress = getRangeProgress(showcaseProgress, 0.2, 0.45);
  const cardThreeProgress = getRangeProgress(showcaseProgress, 0.45, 0.72);

  const cardOneTranslateY = 200 - 200 * cardOneProgress;
  const cardTwoTranslateY = 300 - 280 * cardTwoProgress;
  const cardThreeTranslateY = 380 - 330 * cardThreeProgress;
  const flowVirtualIndex = flowProgress * (HOME_FLOW_STEPS.length - 1);

  const formatMetricValue = (value: number, metric: HomeMetric) => {
    if (metric.decimals && metric.decimals > 0) {
      return `${value.toFixed(metric.decimals)}${metric.suffix}`;
    }

    return `${Math.round(value)}${metric.suffix}`;
  };

  return (
    <main className="min-h-screen [font-family:'Avenir_Next','Helvetica_Neue','Segoe_UI',sans-serif]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={openHome}
              className="text-[36px] font-semibold leading-none tracking-[-0.06em]"
            >
              EMarket
            </button>
            <nav className="hidden items-center gap-6 text-[15px] text-black/80 lg:flex">
              {PRIMARY_NAV.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "transition hover:text-black",
                    activeView === item && "font-semibold text-black"
                  )}
                  onClick={() => {
                    setIsProductDialogOpen(false);
                    setActiveView(item);
                    if (item === "Product") {
                      requestAnimationFrame(() => {
                        document
                          .getElementById("product-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                          });
                      });
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-5 text-sm md:flex">
            <Button
              className="h-10 bg-[#1664ff] px-5 text-white shadow-none hover:bg-[#0f52d9]"
              size="sm"
            >
              Log in
            </Button>
          </div>
        </div>
        <div className="border-t border-black/10">
          <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between px-4 py-3 md:px-8">
            <p className="text-lg font-semibold tracking-[-0.02em]">
              eCommerce
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <nav className="hidden items-center gap-5 text-[15px] text-black/80 md:flex">
                {SECONDARY_NAV.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="transition hover:text-black"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-[#9bbbec]">
        <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center px-6 pb-20 pt-16 text-center md:px-10 md:pb-24 md:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/72 md:text-sm">
            Build an ecommerce website
          </p>
          <h1 className="mt-6 text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-black md:text-8xl">
            Sell sooner.
            <br />
            Scale without limits.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-black/78 md:text-[34px] md:leading-[1.4]">
            Run your storefront, manage products, and complete checkout on one
            clean flow.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 bg-black px-7 text-base text-white shadow-none hover:bg-black/85"
              onClick={openProductSection}
            >
              View Products
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 border-black/20 bg-white/85 px-7 text-base text-black hover:bg-white"
            >
              <Link href="/checkout">Go to Checkout</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-black/66">
            {pagination?.total ?? 0} products ready to browse.
          </p>
        </div>
      </section>

      {activeView === "Product" ? (
        <section
          id="product-section"
          className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-8 md:px-8 md:py-10"
        >
          <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[rgba(255,252,247,0.74)] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Catalog
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)] md:text-3xl">
                {selectedCategory
                  ? CATEGORY_LABELS[selectedCategory]
                  : "All products"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "secondary"}
                onClick={() => handleCategoryChange(undefined)}
              >
                All
              </Button>
              {PRODUCT_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  onClick={() => handleCategoryChange(category)}
                >
                  {CATEGORY_LABELS[category]}
                </Button>
              ))}
            </div>
          </div>

          {(isLoading || isPending) && <ProductGridSkeleton />}

          {!isLoading && !isPending && error ? (
            <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
              <CardContent className="p-6 text-sm text-[var(--muted)]">
                Failed to load products. {error.message}
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && !isPending && !error ? (
            <>
              {products.length === 0 ? (
                <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
                  <CardContent className="p-6 text-sm text-[var(--muted)]">
                    No products found for this category.
                  </CardContent>
                </Card>
              ) : null}

              <div
                className={cn(
                  "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
                  isFetching && "opacity-70 transition-opacity"
                )}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProductDetail}
                    onAdd={handleAddToBag}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 shadow-[var(--shadow)] md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    Page {pagination?.page ?? 1} of{" "}
                    {pagination?.totalPages ?? 1}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {pagination?.total ?? 0} products in current catalog.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    disabled={!pagination || pagination.page <= 1}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPage((current) => current + 1)}
                    disabled={
                      !pagination || pagination.page >= pagination.totalPages
                    }
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </section>
      ) : activeView === "Home" ? (
        <>
          <section
            ref={showcaseRef}
            className="relative mx-auto h-[240vh] w-full max-w-[1480px] px-4 py-8 md:px-8 md:py-10"
          >
            <div className="sticky top-20 h-[calc(100vh-7rem)]">
              <div className="flex h-full items-start">
                <div className="relative h-[50vh] min-h-[420px] w-full -translate-y-2 overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,251,246,0.88),rgba(246,236,225,0.72))] p-4 md:-translate-y-4 md:p-6">
                  <article
                    className="absolute left-4 right-4 top-4 z-10 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_28px_70px_rgba(39,30,22,0.15)] transition-transform duration-100 md:left-8 md:right-8"
                    style={{
                      transform: `translateY(${cardOneTranslateY}px) scale(1)`
                    }}
                  >
                    <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr] md:gap-6 md:p-6">
                      <div className="h-52 overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] md:h-full">
                        <ProductImage
                          alt={showcaseProducts[0].name}
                          category={showcaseProducts[0].category}
                          imageUrl={showcaseProducts[0].imageUrl}
                          className="h-full w-full"
                          imageClassName="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                          Featured Item
                        </p>
                        <h3 className="text-3xl font-semibold text-[var(--text)]">
                          {showcaseProducts[0].name}
                        </h3>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                          {showcaseProducts[0].description}
                        </p>
                        <p className="text-2xl font-semibold text-[var(--text)]">
                          {formatCurrency(showcaseProducts[0].price)}
                        </p>
                      </div>
                    </div>
                  </article>

                  <article
                    className="absolute left-4 right-4 top-10 z-20 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_30px_75px_rgba(39,30,22,0.18)] transition-transform duration-100 md:left-8 md:right-8"
                    style={{
                      transform: `translateY(${cardTwoTranslateY}px) scale(${0.985 + cardTwoProgress * 0.015})`,
                      opacity: 0.2 + cardTwoProgress * 0.8
                    }}
                  >
                    <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr] md:gap-6 md:p-6">
                      <div className="h-52 overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] md:h-full">
                        <ProductImage
                          alt={showcaseProducts[1].name}
                          category={showcaseProducts[1].category}
                          imageUrl={showcaseProducts[1].imageUrl}
                          className="h-full w-full"
                          imageClassName="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                          Next Reveal
                        </p>
                        <h3 className="text-3xl font-semibold text-[var(--text)]">
                          {showcaseProducts[1].name}
                        </h3>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                          {showcaseProducts[1].description}
                        </p>
                        <p className="text-2xl font-semibold text-[var(--text)]">
                          {formatCurrency(showcaseProducts[1].price)}
                        </p>
                      </div>
                    </div>
                  </article>

                  <article
                    className="absolute left-4 right-4 top-16 z-30 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_32px_82px_rgba(39,30,22,0.2)] transition-transform duration-100 md:left-8 md:right-8"
                    style={{
                      transform: `translateY(${cardThreeTranslateY}px) scale(${0.97 + cardThreeProgress * 0.03})`,
                      opacity: 0.12 + cardThreeProgress * 0.88
                    }}
                  >
                    <div className="grid gap-4 p-4 md:grid-cols-[320px_1fr] md:gap-6 md:p-6">
                      <div className="h-52 overflow-hidden rounded-[22px] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))] md:h-full">
                        <ProductImage
                          alt={showcaseProducts[2].name}
                          category={showcaseProducts[2].category}
                          imageUrl={showcaseProducts[2].imageUrl}
                          className="h-full w-full"
                          imageClassName="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                          Final Layer
                        </p>
                        <h3 className="text-3xl font-semibold text-[var(--text)]">
                          {showcaseProducts[2].name}
                        </h3>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                          {showcaseProducts[2].description}
                        </p>
                        <p className="text-2xl font-semibold text-[var(--text)]">
                          {formatCurrency(showcaseProducts[2].price)}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section
            ref={metricsSectionRef}
            data-home-reveal
            className="home-reveal mx-auto w-full max-w-[1480px] px-4 pb-6 md:px-8"
          >
            <div className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(160deg,rgba(255,251,245,0.95),rgba(242,231,219,0.86))] p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                {HOME_METRICS.map((metric, index) => (
                  <article
                    key={metric.label}
                    className="rounded-[24px] border border-[color:var(--border)] bg-white/70 p-5"
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
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-hidden rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,253,248,0.94),rgba(242,232,221,0.82))] p-5 md:p-8">
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
                          "rounded-[20px] border border-[color:var(--border)] bg-white/70 p-4 transition-all duration-400",
                          index === activeFlowStep
                            ? "shadow-[0_14px_36px_rgba(38,27,18,0.12)]"
                            : "opacity-70"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "h-[2px] rounded-full bg-[var(--accent)] transition-all duration-300",
                              index === activeFlowStep
                                ? "w-10"
                                : "w-4 opacity-45"
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

                <div className="relative hidden h-full overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(150deg,rgba(255,255,255,0.75),rgba(248,238,227,0.68))] lg:block">
                  {HOME_FLOW_STEPS.map((step, index) => {
                    const delta = index - flowVirtualIndex;
                    const translateY = 58 + delta * 82;
                    const scale = Math.max(0.84, 1 - Math.abs(delta) * 0.08);
                    const opacity = Math.max(0.16, 1 - Math.abs(delta) * 0.45);
                    const product =
                      showcaseProducts[index % showcaseProducts.length];

                    return (
                      <article
                        key={step.badge}
                        className="absolute left-7 right-7 top-6 overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_22px_50px_rgba(39,30,22,0.14)] transition-transform duration-300"
                        style={{
                          transform: `translateY(${translateY}px) scale(${scale})`,
                          opacity,
                          zIndex: HOME_FLOW_STEPS.length - index
                        }}
                      >
                        <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
                          <div className="h-36 overflow-hidden rounded-[18px] bg-[linear-gradient(140deg,rgba(255,248,238,0.98),rgba(233,219,207,0.85))]">
                            <ProductImage
                              alt={product.name}
                              category={product.category}
                              imageUrl={product.imageUrl}
                              className="h-full w-full"
                              imageClassName="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                              {step.badge}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">
                              {product.name}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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
              className="pointer-events-auto h-12 rounded-full bg-black px-6 text-sm text-white shadow-[0_18px_38px_rgba(14,14,14,0.26)] hover:bg-black/85"
              onClick={openProductSection}
            >
              Browse Products
            </Button>
          </div>
        </>
      ) : (
        <section className="mx-auto w-full max-w-[1480px] px-4 py-8 md:px-8 md:py-10">
          <Card className="rounded-[28px] border-[color:var(--border)] bg-white/80">
            <CardContent className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {activeView}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--text)]">
                Section content coming next
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Product listing has been moved under the Product top navigation
                item as requested.
              </p>
              <Button className="mt-6" onClick={openProductSection}>
                Back to Product
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <ProductDetailWindow
        open={isProductDialogOpen}
        product={selectedProduct}
        onOpenChange={setIsProductDialogOpen}
        onAdd={handleAddToBag}
        animationMs={PRODUCT_DIALOG_ANIMATION_MS}
      />
    </main>
  );
}
