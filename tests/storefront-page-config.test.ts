import { describe, expect, it } from "vitest";
import {
  HOME_METRICS,
  formatMetricValue,
  getRangeProgress,
  resolveShowcaseProducts
} from "@/components/storefront/storefront-page-config";
import type { Product } from "@/types/product";

function createProduct(
  overrides: Partial<Product> & Pick<Product, "id" | "name">
): Product {
  return {
    id: overrides.id,
    name: overrides.name,
    category: overrides.category ?? "KEYBOARDS",
    description: overrides.description ?? "Test product description",
    price: overrides.price ?? 19900,
    stock: overrides.stock ?? 5,
    imageUrl: overrides.imageUrl ?? "https://example.com/product.jpg",
    isActive: overrides.isActive ?? true,
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString()
  };
}

describe("storefront-page-config", () => {
  it("returns fallback showcase products when the catalog is empty", () => {
    const showcaseProducts = resolveShowcaseProducts([]);

    expect(showcaseProducts).toHaveLength(3);
    expect(showcaseProducts.map((product) => product.name)).toEqual([
      "Creator Desk Bundle",
      "Focus Audio Kit",
      "Ultra Productivity Display"
    ]);
  });

  it("keeps the first catalog products and pads with fallbacks when needed", () => {
    const showcaseProducts = resolveShowcaseProducts([
      createProduct({ id: "1", name: "Alpha Keyboard", category: "KEYBOARDS" }),
      createProduct({ id: "2", name: "Beta Mouse", category: "MICE" })
    ]);

    expect(showcaseProducts).toHaveLength(3);
    expect(showcaseProducts[0]?.name).toBe("Alpha Keyboard");
    expect(showcaseProducts[1]?.name).toBe("Beta Mouse");
    expect(showcaseProducts[2]?.name).toBe("Ultra Productivity Display");
  });

  it("limits showcase products to the first three catalog items", () => {
    const showcaseProducts = resolveShowcaseProducts([
      createProduct({ id: "1", name: "One" }),
      createProduct({ id: "2", name: "Two" }),
      createProduct({ id: "3", name: "Three" }),
      createProduct({ id: "4", name: "Four" })
    ]);

    expect(showcaseProducts.map((product) => product.name)).toEqual([
      "One",
      "Two",
      "Three"
    ]);
  });

  it("clamps range progress between zero and one", () => {
    expect(getRangeProgress(-1, 0, 10)).toBe(0);
    expect(getRangeProgress(5, 0, 10)).toBe(0.5);
    expect(getRangeProgress(12, 0, 10)).toBe(1);
  });

  it("returns one when the range is invalid", () => {
    expect(getRangeProgress(3, 5, 5)).toBe(1);
    expect(getRangeProgress(3, 5, 4)).toBe(1);
  });

  it("formats metric values with rounding rules that match the UI", () => {
    expect(formatMetricValue(18.49, HOME_METRICS[1])).toBe("18%");
    expect(
      formatMetricValue(12.34, {
        label: "Speed",
        helper: "Custom metric",
        suffix: "x",
        target: 0,
        decimals: 1
      })
    ).toBe("12.3x");
  });
});
