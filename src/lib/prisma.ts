import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
