import { PrismaClient } from "@prisma/client";
import { DEMO_ADMIN_ID, DEMO_CUSTOMER_ID } from "../src/lib/demo-user";

const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@emarket.local"
    },
    update: {},
    create: {
      id: DEMO_ADMIN_ID,
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
      id: DEMO_CUSTOMER_ID,
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
        category: "KEYBOARDS",
        description: "Hot-swappable keyboard with tactile switches.",
        price: 12900,
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"
      },
      {
        name: "Wireless Mouse",
        category: "MICE",
        description: "Ergonomic mouse with programmable buttons.",
        price: 5900,
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db"
      },
      {
        name: "4K Monitor",
        category: "MONITORS",
        description: "27-inch monitor calibrated for designers and developers.",
        price: 32900,
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"
      },
      {
        name: "USB-C Dock",
        category: "DESK_SETUP",
        description: "Single-cable docking station for laptops.",
        price: 8900,
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3"
      },
      {
        name: "Noise Cancelling Headphones",
        category: "AUDIO",
        description: "Over-ear headphones for focused work sessions.",
        price: 19900,
        stock: 16,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
      },
      {
        name: "Laptop Stand",
        category: "DESK_SETUP",
        description: "Aluminium stand for better posture and cooling.",
        price: 3900,
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
      },
      {
        name: "Webcam",
        category: "DESK_SETUP",
        description: "1080p webcam with dual microphones.",
        price: 7200,
        stock: 27,
        imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04"
      },
      {
        name: "Portable SSD",
        category: "STORAGE",
        description: "Fast external storage for backups and media.",
        price: 14900,
        stock: 31,
        imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b"
      },
      {
        name: "Desk Lamp",
        category: "DESK_SETUP",
        description: "Warm adjustable light with USB charging.",
        price: 4500,
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
      },
      {
        name: "Productivity Notebook",
        category: "DESK_SETUP",
        description:
          "Dot-grid notebook for planning and architecture sketches.",
        price: 1900,
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57"
      },
      {
        name: "Vertical Ergonomic Mouse",
        category: "MICE",
        description:
          "Natural hand angle design to reduce wrist strain during long sessions.",
        price: 6900,
        stock: 28,
        imageUrl: "https://images.unsplash.com/photo-1613141412501-9012977f1969"
      },
      {
        name: "75% Wireless Keyboard",
        category: "KEYBOARDS",
        description:
          "Compact keyboard with tri-mode connectivity and tactile feedback.",
        price: 14900,
        stock: 24,
        imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef"
      },
      {
        name: "Ultrawide Monitor Arm",
        category: "MONITORS",
        description:
          "Gas-spring arm for ultrawide displays with clean cable routing.",
        price: 11900,
        stock: 14,
        imageUrl: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8"
      },
      {
        name: "USB Audio Interface",
        category: "AUDIO",
        description:
          "Low-latency interface for creators, streamers, and remote meetings.",
        price: 13900,
        stock: 19,
        imageUrl: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625"
      },
      {
        name: "NVMe External Enclosure",
        category: "STORAGE",
        description:
          "Aluminum USB4 enclosure for high-speed portable NVMe workflows.",
        price: 6400,
        stock: 33,
        imageUrl: "https://images.unsplash.com/photo-1617471346061-5d329ab9c574"
      },
      {
        name: "Desk Mat XL",
        category: "DESK_SETUP",
        description:
          "Spacious microfiber mat for keyboard, mouse, and writing comfort.",
        price: 2900,
        stock: 72,
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07"
      },
      {
        name: "1080p Ring-Light Webcam",
        category: "DESK_SETUP",
        description:
          "Webcam with integrated ring light and autofocus for video calls.",
        price: 9600,
        stock: 21,
        imageUrl: "https://images.unsplash.com/photo-1587614382346-acd977736f90"
      },
      {
        name: "Studio Monitor Speakers",
        category: "AUDIO",
        description:
          "Near-field speakers tuned for clear mids and balanced low-end response.",
        price: 22900,
        stock: 11,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
      },
      {
        name: "Calibrated 32-inch 4K Display",
        category: "MONITORS",
        description:
          "Factory-calibrated panel with wide color gamut for design workflows.",
        price: 45900,
        stock: 9,
        imageUrl: "https://images.unsplash.com/photo-1527443195645-1133f7f28990"
      },
      {
        name: "Portable Backup SSD 2TB",
        category: "STORAGE",
        description:
          "Durable NVMe SSD with hardware encryption support for secure backups.",
        price: 21900,
        stock: 26,
        imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f"
      },
      {
        name: "Cable Management Kit",
        category: "DESK_SETUP",
        description:
          "Magnetic clips, sleeves, and trays to keep desk wiring organized.",
        price: 2400,
        stock: 85,
        imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284"
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

  void adminUser;
  void customerUser;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
