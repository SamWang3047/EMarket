-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('KEYBOARDS', 'MICE', 'MONITORS', 'AUDIO', 'STORAGE', 'DESK_SETUP');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'DESK_SETUP';
