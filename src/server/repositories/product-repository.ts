import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class ProductRepository {
  async findMany(args: {
    where: Prisma.ProductWhereInput;
    skip: number;
    take: number;
  }) {
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: args.where,
        skip: args.skip,
        take: args.take,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.product.count({
        where: args.where
      })
    ]);

    return { items, total };
  }
}
