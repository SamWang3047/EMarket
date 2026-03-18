import { ProductCategory } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.nativeEnum(ProductCategory),
  description: z.string().nullable(),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  category: z.nativeEnum(ProductCategory).optional()
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
