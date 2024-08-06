/*
  Warnings:

  - You are about to drop the column `machineId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the column `todoId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the column `machineId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `machineId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `todoId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `todoId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Machine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `entityId` to the `Check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MACHINE', 'TASK');

-- DropForeignKey
ALTER TABLE "Check" DROP CONSTRAINT "Check_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Check" DROP CONSTRAINT "Check_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_todoId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_referenceId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- AlterTable
ALTER TABLE "Check" DROP COLUMN "machineId",
DROP COLUMN "todoId",
ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "machineId",
ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "machineId",
DROP COLUMN "todoId",
ADD COLUMN     "entityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "todoId",
ADD COLUMN     "entityId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Machine";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "Reference";

-- DropTable
DROP TABLE "Todo";

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "type" "Type",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "year" INTEGER,
    "manufacturer" TEXT,
    "serialNumber" TEXT,
    "department" "Departmnet",

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entity_profileId_key" ON "Entity"("profileId");

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
