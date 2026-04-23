import { prisma } from "@/lib/prisma";
import { BadRequestError, NotFoundError } from "@/server/errors";
import { OrderRepository } from "@/server/repositories/order-repository";
import type { CreateOrderInput } from "@/server/schemas/order";

function groupItemsByProduct(items: CreateOrderInput["items"]) {
  // Merge duplicate product lines so stock checks and totals are computed once
  // per product inside the transaction.
  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.quantity
    );
  }

  return Array.from(quantities.entries()).map(([productId, quantity]) => ({
    productId,
    quantity
  }));
}

export class OrderService {
  constructor(private readonly orderRepository = new OrderRepository()) {}

  async createOrder(input: CreateOrderInput) {
    const normalizedItems = groupItemsByProduct(input.items);

    const order = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          id: input.userId,
          deletedAt: null
        }
      });

      if (!user) {
        throw new NotFoundError("User not found.");
      }

      const products = await tx.product.findMany({
        where: {
          id: {
            in: normalizedItems.map((item) => item.productId)
          },
          isActive: true,
          deletedAt: null
        }
      });

      if (products.length !== normalizedItems.length) {
        throw new NotFoundError("One or more products were not found.");
      }

      const productMap = new Map(
        products.map((product) => [product.id, product])
      );

      for (const item of normalizedItems) {
        // updateMany gives us an atomic "decrement only if enough stock exists"
        // check without a separate read-then-write race.
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity
            }
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });

        if (updated.count !== 1) {
          const product = productMap.get(item.productId);
          throw new BadRequestError(
            `Insufficient stock for product ${product?.name ?? item.productId}.`
          );
        }
      }

      // Total is derived from the locked product snapshot used for this order.
      const totalAmount = normalizedItems.reduce((sum, item) => {
        const product = productMap.get(item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0);

      return tx.order.create({
        data: {
          userId: user.id,
          shippingAddress: input.shippingAddress,
          totalAmount,
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: productMap.get(item.productId)?.price ?? 0
            }))
          }
        }
      });
    });

    // Re-read through the repository so the response includes related user and
    // item/product records in the same shape as the API returns.
    const createdOrder = await this.orderRepository.findById(order.id);

    if (!createdOrder) {
      throw new NotFoundError("Order not found after creation.");
    }

    return createdOrder;
  }
}
