import { describe, expect, it } from "vitest";
import { createOrderSchema } from "@/server/schemas/order";

const validOrder = {
  shippingAddress: "123 Test Street, Sydney",
  items: [
    {
      productId: "11111111-1111-4111-8111-111111111111",
      quantity: 1
    }
  ]
};

describe("createOrderSchema", () => {
  it("accepts an order without a client-controlled user id", () => {
    expect(createOrderSchema.parse(validOrder)).toEqual(validOrder);
  });

  it("rejects client-controlled identity fields", () => {
    expect(() =>
      createOrderSchema.parse({
        ...validOrder,
        userId: "22222222-2222-4222-8222-222222222222"
      })
    ).toThrow();
  });
});
