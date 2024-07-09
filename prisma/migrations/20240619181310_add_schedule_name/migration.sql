-- AlterTable
ALTER TABLE "Machine" ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "manufacturer" DROP NOT NULL,
ALTER COLUMN "serialNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "name" TEXT;
