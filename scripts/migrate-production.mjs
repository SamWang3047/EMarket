import { spawnSync } from "node:child_process";

if (process.env.VERCEL_ENV !== "production") {
  console.log(
    "Skipping database migrations outside the Vercel production environment."
  );
  process.exit(0);
}

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL is required for Vercel production migrations.");
}

if (!process.env.npm_execpath) {
  throw new Error("Unable to locate pnpm for Vercel production migrations.");
}

const migration = spawnSync(
  process.execPath,
  [process.env.npm_execpath, "exec", "prisma", "migrate", "deploy"],
  {
    stdio: "inherit",
    // Prisma 6 still reads the schema datasource URL for this command, so make
    // the direct connection explicit in the child process.
    env: { ...process.env, DATABASE_URL: process.env.DIRECT_URL }
  }
);

if (migration.error) {
  throw migration.error;
}

if (migration.status !== 0) {
  process.exit(migration.status ?? 1);
}
