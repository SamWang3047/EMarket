import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { OrderRepository } from "@/server/repositories/order-repository";
import { createUser, hasDatabase, resetDatabase } from "./helpers/database";

const orderRepository = new OrderRepository();
const describeIfDatabase = hasDatabase ? describe : describe.skip;

describeIfDatabase("OrderRepository", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("returns a public order receipt without user credentials", async () => {
    const user = await createUser();
    const product = await prisma.product.create({
      data: {
        name: "Repository SSD",
        category: "STORAGE",
        price: 14900,
        stock: 6
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        shippingAddress: "12 Query Street, Sydney",
        totalAmount: 29800,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              priceAtPurchase: 14900
            }
          ]
        }
      }
    });

    const found = await orderRepository.findReceiptById(order.id);

    expect(found).not.toBeNull();
    expect(found).toEqual(
      expect.objectContaining({
        id: order.id,
        totalAmount: 29800,
        status: "PENDING",
        items: [
          expect.objectContaining({
            quantity: 2,
            priceAtPurchase: 14900,
            product: expect.objectContaining({
              id: product.id,
              name: "Repository SSD"
            })
          })
        ]
      })
    );

    expect(found).not.toHaveProperty("user");
    expect(found).not.toHaveProperty("userId");
    expect(found).not.toHaveProperty("shippingAddress");

    const serialized = JSON.stringify(found);

    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain(user.passwordHash);
  });

  it("returns null when the order does not exist", async () => {
    const found = await orderRepository.findReceiptById("missing-order-id");

    expect(found).toBeNull();
  });
});
