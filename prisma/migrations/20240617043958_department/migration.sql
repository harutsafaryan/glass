/*
  Warnings:

  - You are about to drop the column `departmnet` on the `Machine` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "departmnet",
ADD COLUMN     "department" "Departmnet";
