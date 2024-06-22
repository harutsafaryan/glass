/*
  Warnings:

  - You are about to drop the column `status` on the `Issue` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "status",
ADD COLUMN     "state" "State" NOT NULL DEFAULT 'OPEN';

-- DropEnum
DROP TYPE "IssueStatus";
