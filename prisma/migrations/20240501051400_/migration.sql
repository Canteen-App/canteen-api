/*
  Warnings:

  - A unique constraint covering the columns `[itemId,customerId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite_itemId_customerId_key" ON "Favorite"("itemId", "customerId");
