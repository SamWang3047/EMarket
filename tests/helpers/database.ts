import { prisma } from "@/lib/prisma";

let hasDatabase = false;

try {
  await prisma.$connect();
  hasDatabase = true;
} catch {
  hasDatabase = false;
}

export { hasDatabase };

export async function resetDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
}

export async function createUser() {
  return prisma.user.create({
    data: {
      email: `customer-${crypto.randomUUID()}@example.com`,
      passwordHash: "hashed-password",
      firstName: "Test",
      lastName: "User"
    }
  });
}
