import { apiSuccess, handleApiError } from "@/lib/api";
import { createOrderSchema } from "@/server/schemas/order";
import { OrderService } from "@/server/services/order-service";

const orderService = new OrderService();

export async function POST(request: Request) {
  try {
    const payload = createOrderSchema.parse(await request.json());
    const order = await orderService.createOrder(payload);

    return apiSuccess(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
