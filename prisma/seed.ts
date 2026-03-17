import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@emarket.local"
    },
    update: {},
    create: {
      email: "admin@emarket.local",
      passwordHash: "seeded-admin-password-hash",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN"
    }
  });

  const customerUser = await prisma.user.upsert({
    where: {
      email: "customer@emarket.local"
    },
    update: {},
    create: {
      email: "customer@emarket.local",
      passwordHash: "seeded-customer-password-hash",
      firstName: "Demo",
      lastName: "Customer"
    }
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Mechanical Keyboard",
        description: "Hot-swappable keyboard with tactile switches.",
        price: 12900,
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic mouse with programmable buttons.",
        price: 5900,
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db"
      },
      {
        name: "4K Monitor",
        description: "27-inch monitor calibrated for designers and developers.",
        price: 32900,
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
      },
      {
        name: "USB-C Dock",
        description: "Single-cable docking station for laptops.",
        price: 8900,
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
      },
      {
        name: "Noise Cancelling Headphones",
        description: "Over-ear headphones for focused work sessions.",
        price: 19900,
        stock: 16,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        name: "Laptop Stand",
        description: "Aluminium stand for better posture and cooling.",
        price: 3900,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
      },
      {
        name: "Webcam",
        description: "1080p webcam with dual microphones.",
        price: 7200,
        stock: 27,
        imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04"
      },
      {
        name: "Portable SSD",
        description: "Fast external storage for backups and media.",
        price: 14900,
        stock: 31,
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b"
      },
      {
        name: "Desk Lamp",
        description: "Warm adjustable light with USB charging.",
        price: 4500,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
      },
      {
        name: "Productivity Notebook",
        description: "Dot-grid notebook for planning and architecture sketches.",
        price: 1900,
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57"
      }
    ],
    skipDuplicates: true
  });

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: customerUser.id,
        productId: (
          await prisma.product.findFirstOrThrow({
            where: {
              name: "Mechanical Keyboard"
            }
          })
        ).id
      }
    },
    update: {
      quantity: 1
    },
    create: {
      userId: customerUser.id,
      productId: (
        await prisma.product.findFirstOrThrow({
          where: {
            name: "Mechanical Keyboard"
          }
        })
      ).id,
      quantity: 1
    }
  });

  console.log(`Seed complete. Admin user: ${adminUser.email}, customer user: ${customerUser.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
