-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "recurrence" "Recurrence";
