export const PRODUCT_CATEGORIES = [
  "KEYBOARDS",
  "MICE",
  "MONITORS",
  "AUDIO",
  "STORAGE",
  "DESK_SETUP"
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  KEYBOARDS: "Keyboards",
  MICE: "Mice",
  MONITORS: "Monitors",
  AUDIO: "Audio",
  STORAGE: "Storage",
  DESK_SETUP: "Desk Setup"
};
