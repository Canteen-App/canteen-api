/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `OrderVerifyCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderVerifyCode_code_key" ON "OrderVerifyCode"("code");
