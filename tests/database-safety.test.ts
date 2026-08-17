import { describe, expect, it } from "vitest";
import { assertSafeToSeed } from "@/server/database-safety";

describe("database seed safety", () => {
  it("allows local development databases", () => {
    expect(() =>
      assertSafeToSeed({
        databaseUrl: "postgresql://user:password@localhost:5432/emarket",
        nodeEnv: "development"
      })
    ).not.toThrow();
  });

  it("always blocks production seeding", () => {
    expect(() =>
      assertSafeToSeed({
        databaseUrl: "postgresql://user:password@localhost:5432/emarket",
        nodeEnv: "production",
        allowRemoteSeed: true
      })
    ).toThrow(/disabled/i);
  });

  it("blocks ambiguous remote databases unless explicitly allowed", () => {
    const environment = {
      databaseUrl: "postgresql://user:password@database.example.com/emarket",
      nodeEnv: "development"
    };

    expect(() => assertSafeToSeed(environment)).toThrow(/refusing/i);
    expect(() =>
      assertSafeToSeed({ ...environment, allowRemoteSeed: true })
    ).not.toThrow();
  });
});
