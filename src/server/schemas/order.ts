import { z } from "zod";

export const createOrderSchema = z
  .object({
    shippingAddress: z.string().trim().min(5).max(240),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive()
        })
      )
      .min(1)
  })
  .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
