import { describe, expect, it } from "vitest";
import {
  isBasicAuthAuthorized,
  resolveBasicAuthCredentials
} from "@/lib/basic-auth";

describe("basic authentication", () => {
  it("stays disabled in development when no credentials are configured", () => {
    expect(resolveBasicAuthCredentials({ nodeEnv: "development" })).toBeNull();
  });

  it("fails closed in production when credentials are missing or weak", () => {
    expect(() =>
      resolveBasicAuthCredentials({ nodeEnv: "production" })
    ).toThrow(/must both be configured/i);
    expect(() =>
      resolveBasicAuthCredentials({
        nodeEnv: "production",
        username: "owner",
        password: "short"
      })
    ).toThrow(/at least 12 characters/i);
  });

  it("accepts only the configured username and password", () => {
    const credentials = resolveBasicAuthCredentials({
      nodeEnv: "production",
      username: "owner",
      password: "a-long-password"
    });

    expect(credentials).not.toBeNull();
    expect(
      isBasicAuthAuthorized(
        `Basic ${btoa("owner:a-long-password")}`,
        credentials!
      )
    ).toBe(true);
    expect(
      isBasicAuthAuthorized(
        `Basic ${btoa("owner:wrong-password")}`,
        credentials!
      )
    ).toBe(false);
    expect(isBasicAuthAuthorized("Bearer token", credentials!)).toBe(false);
  });
});
