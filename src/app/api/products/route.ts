import { apiSuccess, handleApiError } from "@/lib/api";
import { ProductService } from "@/server/services/product-service";
import { listProductsQuerySchema } from "@/server/schemas/product";

const productService = new ProductService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = listProductsQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      category: searchParams.get("category") ?? undefined
    });

    const result = await productService.listProducts(query);

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
