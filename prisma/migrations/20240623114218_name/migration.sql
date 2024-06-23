/*
  Warnings:

  - Added the required column `name` to the `Check` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Check" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "scheduledAt" TIMESTAMP(3);
