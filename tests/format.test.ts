import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats cents into AUD currency", () => {
    expect(formatCurrency(28900)).toBe("$289.00");
    expect(formatCurrency(16900)).toBe("$169.00");
  });

  it("keeps cents for non-round amounts", () => {
    expect(formatCurrency(12345)).toBe("$123.45");
  });
});
