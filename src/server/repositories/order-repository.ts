import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const orderReceiptSelect = {
  id: true,
  status: true,
  totalAmount: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      priceAtPurchase: true,
      product: {
        select: {
          id: true,
          name: true,
          category: true,
          imageUrl: true
        }
      }
    }
  }
} satisfies Prisma.OrderSelect;

export type OrderReceipt = Prisma.OrderGetPayload<{
  select: typeof orderReceiptSelect;
}>;

export class OrderRepository {
  async findReceiptById(id: string): Promise<OrderReceipt | null> {
    return prisma.order.findUnique({
      where: { id },
      select: orderReceiptSelect
    });
  }
}
