type SeedSafetyEnvironment = {
  databaseUrl?: string;
  nodeEnv?: string;
  allowRemoteSeed?: boolean;
};

const LOCAL_DATABASE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "[::1]",
  "db"
]);

export function assertSafeToSeed({
  databaseUrl,
  nodeEnv,
  allowRemoteSeed = false
}: SeedSafetyEnvironment) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before seeding.");
  }

  if (nodeEnv === "production") {
    throw new Error("Database seeding is disabled when NODE_ENV=production.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL.");
  }

  if (!["postgres:", "postgresql:"].includes(parsedUrl.protocol)) {
    throw new Error("Database seeding only supports PostgreSQL URLs.");
  }

  const databaseName = decodeURIComponent(parsedUrl.pathname.slice(1));
  const isClearlyNonProduction = /(dev|local|test)/i.test(databaseName);
  const isLocalDatabase = LOCAL_DATABASE_HOSTS.has(parsedUrl.hostname);

  if (!isLocalDatabase && !isClearlyNonProduction && !allowRemoteSeed) {
    throw new Error(
      "Refusing to seed a remote database without an explicit non-production database name. Set ALLOW_REMOTE_DATABASE_SEED=true only for a disposable database."
    );
  }
}
