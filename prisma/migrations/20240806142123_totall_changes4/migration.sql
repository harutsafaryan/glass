/*
  Warnings:

  - You are about to drop the column `profileId` on the `Entity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entityId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_profileId_fkey";

-- DropIndex
DROP INDEX "Entity_profileId_key";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "entityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_entityId_key" ON "Profile"("entityId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
