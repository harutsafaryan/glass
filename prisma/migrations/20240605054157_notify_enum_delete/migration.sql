/*
  Warnings:

  - You are about to drop the column `notify` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "notify";

-- DropEnum
DROP TYPE "Notify";
