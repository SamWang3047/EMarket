import { prisma } from "@/lib/prisma";

export class OrderRepository {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });
  }
}
