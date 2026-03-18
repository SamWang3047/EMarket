import type { Prisma } from "@prisma/client";
import { ProductRepository } from "@/server/repositories/product-repository";
import type { ListProductsQuery } from "@/server/schemas/product";

export class ProductService {
  constructor(private readonly productRepository = new ProductRepository()) {}

  async listProducts(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
      ...(query.category ? { category: query.category } : {})
    };
    const skip = (query.page - 1) * query.pageSize;

    const { items, total } = await this.productRepository.findMany({
      where,
      skip,
      take: query.pageSize
    });

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize))
      }
    };
  }
}
