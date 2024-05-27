/*
  Warnings:

  - You are about to drop the column `date` on the `Reference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Periodicity" ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "date";
