-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "cartUserCartId" TEXT;

-- CreateTable
CREATE TABLE "Cart" (
    "userCartId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("userCartId")
);

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_cartUserCartId_fkey" FOREIGN KEY ("cartUserCartId") REFERENCES "Cart"("userCartId") ON DELETE SET NULL ON UPDATE CASCADE;
