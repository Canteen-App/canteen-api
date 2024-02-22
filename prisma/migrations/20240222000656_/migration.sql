/*
  Warnings:

  - You are about to drop the column `information` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "information",
ADD COLUMN     "description" TEXT;
