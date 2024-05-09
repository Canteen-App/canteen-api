-- CreateTable
CREATE TABLE "OrderVerifyCode" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderVerifyCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderVerifyCode_orderId_key" ON "OrderVerifyCode"("orderId");

-- AddForeignKey
ALTER TABLE "OrderVerifyCode" ADD CONSTRAINT "OrderVerifyCode_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
