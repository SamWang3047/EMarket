import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCartCount,
  getCartSubtotal,
  useCartStore
} from "@/stores/cart-store";
import type { Product } from "@/types/product";

function createProduct(
  overrides: Partial<Product> & Pick<Product, "id" | "name">
): Product {
  return {
    id: overrides.id,
    name: overrides.name,
    category: overrides.category ?? "KEYBOARDS",
    description: overrides.description ?? "Test product description",
    price: overrides.price ?? 12900,
    stock: overrides.stock ?? 5,
    imageUrl: overrides.imageUrl ?? "https://example.com/product.jpg",
    isActive: overrides.isActive ?? true,
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString()
  };
}

describe("cart-store", () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      }
    });

    useCartStore.setState({ items: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds a new product to the bag with quantity one", () => {
    useCartStore
      .getState()
      .addItem(createProduct({ id: "keyboard-1", name: "Studio Keyboard" }));

    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({
        productId: "keyboard-1",
        name: "Studio Keyboard",
        quantity: 1,
        stock: 5
      })
    ]);
  });

  it("increments an existing line item and caps quantity at current stock", () => {
    const product = createProduct({
      id: "audio-1",
      name: "Focus Headphones",
      category: "AUDIO",
      stock: 2
    });

    const store = useCartStore.getState();
    store.addItem(product);
    store.addItem(product);
    store.addItem(product);

    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
  });

  it("refreshes stored stock from the latest product payload", () => {
    const initial = createProduct({
      id: "monitor-1",
      name: "Creator Monitor",
      category: "MONITORS",
      stock: 5
    });
    const updated = createProduct({
      id: "monitor-1",
      name: "Creator Monitor",
      category: "MONITORS",
      stock: 2
    });

    const store = useCartStore.getState();
    store.addItem(initial);
    store.addItem(updated);

    expect(useCartStore.getState().items[0]).toEqual(
      expect.objectContaining({
        quantity: 2,
        stock: 2
      })
    );
  });

  it("clamps quantity updates between one and available stock", () => {
    const product = createProduct({
      id: "mouse-1",
      name: "Precision Mouse",
      category: "MICE",
      stock: 3
    });

    const store = useCartStore.getState();
    store.addItem(product);
    store.updateQuantity(product.id, 99);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);

    store.updateQuantity(product.id, 0);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
  });

  it("removes items and clears the whole bag", () => {
    const keyboard = createProduct({ id: "keyboard-2", name: "Typing Board" });
    const mouse = createProduct({
      id: "mouse-2",
      name: "Travel Mouse",
      category: "MICE"
    });

    const store = useCartStore.getState();
    store.addItem(keyboard);
    store.addItem(mouse);
    store.removeItem(keyboard.id);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.productId).toBe("mouse-2");

    store.clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("computes total item count and subtotal from cart lines", () => {
    const items = [
      {
        productId: "a",
        name: "Keyboard",
        price: 10000,
        imageUrl: null,
        category: "KEYBOARDS" as const,
        quantity: 2,
        stock: 10
      },
      {
        productId: "b",
        name: "Mouse",
        price: 5000,
        imageUrl: null,
        category: "MICE" as const,
        quantity: 3,
        stock: 10
      }
    ];

    expect(getCartCount(items)).toBe(5);
    expect(getCartSubtotal(items)).toBe(35000);
  });
});
