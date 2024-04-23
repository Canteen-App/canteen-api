/*
  Warnings:

  - You are about to drop the column `pickedUp` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "pickedUp",
ADD COLUMN     "quantityCollected" INTEGER NOT NULL DEFAULT 0;
