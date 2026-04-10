import type { Product } from "@/types/product";

export const PAGE_SIZE = 9;
export const PRODUCT_DIALOG_ANIMATION_MS = 500;
export const SHOWCASE_TRIGGER_VIEWPORT_RATIO = 0.82;
export const SHOWCASE_WHEEL_SENSITIVITY = 0.0012;
export const SHOWCASE_WHEEL_MAX_STEP = 0.08;
export const HOME_SCROLL_CTA_RATIO = 0.55;
export const HOME_METRIC_DURATION_MS = 1100;

export const PRIMARY_NAV = [
  "Product",
  "Solutions",
  "Resources",
  "Wix Studio",
  "Enterprise"
] as const;

export const SECONDARY_NAV = ["Start", "Sell", "Manage", "Learn", "Pricing"];
export const THEME_STORAGE_KEY = "emarket.theme";
export const THEMES = [
  { id: "sand", label: "Sand" },
  { id: "evergreen", label: "Evergreen" },
  { id: "graphite", label: "Graphite" }
] as const;

export type PrimaryNavItem = (typeof PRIMARY_NAV)[number];
export type StorefrontView = "Home" | PrimaryNavItem;
export type ThemeId = (typeof THEMES)[number]["id"];

export type ShowcaseProduct = Pick<
  Product,
  "name" | "description" | "price" | "category" | "imageUrl"
>;

export type HomeMetric = {
  label: string;
  helper: string;
  suffix: string;
  target: number;
  decimals?: number;
};

export const HOME_METRICS: HomeMetric[] = [
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

export const HOME_FLOW_STEPS = [
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

const FALLBACK_SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
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

export function resolveShowcaseProducts(
  products: Product[]
): ShowcaseProduct[] {
  if (!products.length) {
    return FALLBACK_SHOWCASE_PRODUCTS;
  }

  const selected = products.slice(0, 3).map((product) => ({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl
  }));

  while (selected.length < 3) {
    selected.push(FALLBACK_SHOWCASE_PRODUCTS[selected.length]);
  }

  return selected;
}

export function getRangeProgress(value: number, start: number, end: number) {
  if (end <= start) {
    return 1;
  }

  return Math.min(Math.max((value - start) / (end - start), 0), 1);
}

export function formatMetricValue(value: number, metric: HomeMetric) {
  if (metric.decimals && metric.decimals > 0) {
    return `${value.toFixed(metric.decimals)}${metric.suffix}`;
  }

  return `${Math.round(value)}${metric.suffix}`;
}
