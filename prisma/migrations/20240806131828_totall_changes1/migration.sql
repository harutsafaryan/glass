/*
  Warnings:

  - Added the required column `name` to the `Entity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "name" TEXT NOT NULL;
