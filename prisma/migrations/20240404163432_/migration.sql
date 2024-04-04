-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_cartUserCartId_fkey";

-- CreateTable
CREATE TABLE "CartItem" (
    "quantity" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "cartUserCartId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("itemId","cartUserCartId")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartUserCartId_fkey" FOREIGN KEY ("cartUserCartId") REFERENCES "Cart"("userCartId") ON DELETE RESTRICT ON UPDATE CASCADE;
