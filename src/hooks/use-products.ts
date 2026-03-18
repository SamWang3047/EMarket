"use client";

import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@/lib/constants";
import type { ProductsResponse } from "@/types/product";

type UseProductsParams = {
  page: number;
  pageSize: number;
  category?: ProductCategory;
};

async function fetchProducts(params: UseProductsParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize)
  });

  if (params.category) {
    searchParams.set("category", params.category);
  }

  const response = await fetch(`/api/products?${searchParams.toString()}`);

  const payload = (await response.json()) as {
    success: boolean;
    data: ProductsResponse;
    error: { message: string } | null;
  };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? "Failed to load products.");
  }

  return payload.data;
}

export function useProducts(params: UseProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params)
  });
}
