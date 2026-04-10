import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { BadRequestError } from "@/server/errors";
import { OrderService } from "@/server/services/order-service";

const orderService = new OrderService();
let hasDatabase = false;

try {
  await prisma.$connect();
  hasDatabase = true;
} catch {
  hasDatabase = false;
}

async function resetDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser() {
  return prisma.user.create({
    data: {
      email: `customer-${crypto.randomUUID()}@example.com`,
      passwordHash: "hashed-password",
      firstName: "Test",
      lastName: "User"
    }
  });
}

const describeIfDatabase = hasDatabase ? describe : describe.skip;

describeIfDatabase("OrderService", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("creates an order and deducts stock when inventory is sufficient", async () => {
    const user = await createUser();
    const product = await prisma.product.create({
      data: {
        name: "Transactional Keyboard",
        category: "KEYBOARDS",
        description: "A product used for transaction tests.",
        price: 12900,
        stock: 5
      }
    });

    const order = await orderService.createOrder({
      userId: user.id,
      shippingAddress: "123 Test Street, Sydney",
      items: [
        {
          productId: product.id,
          quantity: 2
        }
      ]
    });

    const updatedProduct = await prisma.product.findUniqueOrThrow({
      where: { id: product.id }
    });

    expect(order.totalAmount).toBe(25800);
    expect(order.items).toHaveLength(1);
    expect(order.items[0]?.priceAtPurchase).toBe(12900);
    expect(updatedProduct.stock).toBe(3);
  });

  it("rolls back the whole transaction when one product runs out of stock", async () => {
    const user = await createUser();
    const keyboard = await prisma.product.create({
      data: {
        name: "Rollback Keyboard",
        category: "KEYBOARDS",
        price: 9900,
        stock: 3
      }
    });
    const mouse = await prisma.product.create({
      data: {
        name: "Rollback Mouse",
        category: "MICE",
        price: 4900,
        stock: 0
      }
    });

    await expect(
      orderService.createOrder({
        userId: user.id,
        shippingAddress: "456 Failure Road, Sydney",
        items: [
          {
            productId: keyboard.id,
            quantity: 1
          },
          {
            productId: mouse.id,
            quantity: 1
          }
        ]
      })
    ).rejects.toBeInstanceOf(BadRequestError);

    const [reloadedKeyboard, reloadedMouse, orderCount] = await Promise.all([
      prisma.product.findUniqueOrThrow({
        where: { id: keyboard.id }
      }),
      prisma.product.findUniqueOrThrow({
        where: { id: mouse.id }
      }),
      prisma.order.count()
    ]);

    expect(reloadedKeyboard.stock).toBe(3);
    expect(reloadedMouse.stock).toBe(0);
    expect(orderCount).toBe(0);
  });

  it("allows the first order and rejects the second when stock is exhausted", async () => {
    const user = await createUser();
    const product = await prisma.product.create({
      data: {
        name: "Race Condition SSD",
        category: "STORAGE",
        price: 14900,
        stock: 1
      }
    });

    await orderService.createOrder({
      userId: user.id,
      shippingAddress: "789 Sequential Avenue, Sydney",
      items: [
        {
          productId: product.id,
          quantity: 1
        }
      ]
    });

    await expect(
      orderService.createOrder({
        userId: user.id,
        shippingAddress: "789 Sequential Avenue, Sydney",
        items: [
          {
            productId: product.id,
            quantity: 1
          }
        ]
      })
    ).rejects.toBeInstanceOf(BadRequestError);

    const [updatedProduct, orderCount] = await Promise.all([
      prisma.product.findUniqueOrThrow({
        where: { id: product.id }
      }),
      prisma.order.count()
    ]);

    expect(updatedProduct.stock).toBe(0);
    expect(orderCount).toBe(1);
  });
});
