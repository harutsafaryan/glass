/*
  Warnings:

  - The values [UNKNOWN,CHECKED,FAIL] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('SUCCESS', 'WARNING', 'ERROR');
ALTER TABLE "Check" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Check" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Check" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';
COMMIT;

-- AlterTable
ALTER TABLE "Check" ALTER COLUMN "status" SET DEFAULT 'SUCCESS';
