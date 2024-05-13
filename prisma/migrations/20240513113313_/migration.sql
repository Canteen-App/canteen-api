/*
  Warnings:

  - You are about to drop the column `orderTime` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderTime",
ADD COLUMN     "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderPlaced" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
