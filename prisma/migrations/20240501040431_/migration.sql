-- CreateTable
CREATE TABLE "Favorite" (
    "itemId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("itemId","customerId")
);

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
