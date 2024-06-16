-- CreateEnum
CREATE TYPE "Departmnet" AS ENUM ('GLASS', 'ALUMINUM', 'FURNITURE', 'STK');

-- DropForeignKey
ALTER TABLE "Check" DROP CONSTRAINT "Check_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_todoId_fkey";

-- AlterTable
ALTER TABLE "Check" ADD COLUMN     "machineId" TEXT,
ALTER COLUMN "todoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "machineId" TEXT,
ALTER COLUMN "todoId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "machineId" TEXT,
ALTER COLUMN "todoId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "departmnet" "Departmnet",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
