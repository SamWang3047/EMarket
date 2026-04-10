"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types/product";

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: Product["category"];
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      stock: product.stock,
                      quantity: Math.min(item.quantity + 1, product.stock)
                    }
                  : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
                quantity: 1,
                stock: product.stock
              }
            ]
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: Math.max(1, Math.min(quantity, item.stock))
                  }
                : item
            )
            .filter((item) => item.quantity > 0)
        })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: "emarket-cart",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage
      ),
      partialize: (state) => ({
        items: state.items
      })
    }
  )
);

export function getCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
