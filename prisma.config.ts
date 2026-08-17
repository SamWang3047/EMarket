import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Prisma 6 CLI operations prefer directUrl for migrations. Local
    // development keeps working with only DATABASE_URL configured.
    directUrl: process.env.DIRECT_URL ?? env("DATABASE_URL")
  }
});
