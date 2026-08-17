import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Vercel sets PORT=0 while building. Zero is also a valid request for an
  // ephemeral Node.js port, while standalone and Docker deployments use 3000.
  PORT: z.coerce.number().int().min(0).max(65535).default(3000)
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});
