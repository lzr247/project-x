/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "isCompleted",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE';
