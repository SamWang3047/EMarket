import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

function isSafeTestDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    const databaseName = url.pathname.replace(/^\//, "").toLowerCase();

    return databaseName.includes("test");
  } catch {
    return false;
  }
}

let hasDatabase = false;

if (env.NODE_ENV === "test" && isSafeTestDatabaseUrl(env.DATABASE_URL)) {
  try {
    await prisma.$connect();
    hasDatabase = true;
  } catch {
    hasDatabase = false;
  }
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
