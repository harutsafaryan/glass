/*
  Warnings:

  - You are about to drop the column `department` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "department",
DROP COLUMN "manufacturer",
DROP COLUMN "serialNumber",
DROP COLUMN "year",
ADD COLUMN     "data" JSONB;
