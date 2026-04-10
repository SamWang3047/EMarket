import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ProductRepository } from "@/server/repositories/product-repository";
import { hasDatabase, resetDatabase } from "./helpers/database";

const productRepository = new ProductRepository();
const describeIfDatabase = hasDatabase ? describe : describe.skip;

describeIfDatabase("Prisma Product CRUD", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it("creates and reads a product record", async () => {
    const created = await prisma.product.create({
      data: {
        name: "CRUD Keyboard",
        category: "KEYBOARDS",
        description: "Created by integration test.",
        price: 15900,
        stock: 12,
        imageUrl: "https://example.com/keyboard.jpg"
      }
    });

    const found = await prisma.product.findUnique({
      where: { id: created.id }
    });

    expect(found).toEqual(
      expect.objectContaining({
        id: created.id,
        name: "CRUD Keyboard",
        category: "KEYBOARDS",
        price: 15900,
        stock: 12
      })
    );
  });

  it("updates product fields and persists the new values", async () => {
    const product = await prisma.product.create({
      data: {
        name: "CRUD Monitor",
        category: "MONITORS",
        price: 32900,
        stock: 4
      }
    });

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        price: 34900,
        stock: 7,
        description: "Updated by integration test."
      }
    });

    expect(updated).toEqual(
      expect.objectContaining({
        id: product.id,
        price: 34900,
        stock: 7,
        description: "Updated by integration test."
      })
    );
  });

  it("returns only active and non-deleted products through the repository", async () => {
    const visible = await prisma.product.create({
      data: {
        name: "Visible Mouse",
        category: "MICE",
        price: 5900,
        stock: 20
      }
    });

    await prisma.product.create({
      data: {
        name: "Inactive Mouse",
        category: "MICE",
        price: 4900,
        stock: 20,
        isActive: false
      }
    });

    await prisma.product.create({
      data: {
        name: "Deleted Mouse",
        category: "MICE",
        price: 6900,
        stock: 20,
        deletedAt: new Date()
      }
    });

    const result = await productRepository.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      skip: 0,
      take: 20
    });

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe(visible.id);
  });

  it("deletes a product record permanently", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Delete Me Dock",
        category: "DESK_SETUP",
        price: 8900,
        stock: 8
      }
    });

    await prisma.product.delete({
      where: { id: product.id }
    });

    const found = await prisma.product.findUnique({
      where: { id: product.id }
    });

    expect(found).toBeNull();
  });
});
