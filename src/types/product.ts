import type { ProductCategory } from "@/lib/constants";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  items: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
