import { apiSuccess, handleApiError } from "@/lib/api";
import { DEMO_CUSTOMER_ID } from "@/lib/demo-user";
import { createOrderSchema } from "@/server/schemas/order";
import { OrderService } from "@/server/services/order-service";

const orderService = new OrderService();

export async function POST(request: Request) {
  try {
    const payload = createOrderSchema.parse(await request.json());
    const order = await orderService.createOrder(DEMO_CUSTOMER_ID, payload);

    return apiSuccess(order, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
