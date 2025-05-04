/*
  Warnings:

  - You are about to drop the column `completed` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Milestone` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Milestone" DROP COLUMN "completed",
DROP COLUMN "dueDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imageData" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dueDate",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
