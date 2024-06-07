/*
  Warnings:

  - Made the column `periodic` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Notify" AS ENUM ('UNKNOWN', 'URGENT', 'ERROR', 'DELAY', 'REMINDER');

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "remark" DROP NOT NULL,
ALTER COLUMN "periodic" SET NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notify" "Notify" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
