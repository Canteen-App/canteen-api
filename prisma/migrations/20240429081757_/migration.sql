-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "canceledTime" TIMESTAMP(3),
ADD COLUMN     "paymentTime" TIMESTAMP(3);
