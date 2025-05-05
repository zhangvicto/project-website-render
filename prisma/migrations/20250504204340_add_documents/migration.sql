/*
  Warnings:

  - You are about to drop the `CustomTable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomTableRow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomTable" DROP CONSTRAINT "CustomTable_projectId_fkey";

-- DropForeignKey
ALTER TABLE "CustomTableRow" DROP CONSTRAINT "CustomTableRow_tableId_fkey";

-- AlterTable
ALTER TABLE "Milestone" ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "endDate" DROP DEFAULT,
ALTER COLUMN "startDate" DROP DEFAULT;

-- DropTable
DROP TABLE "CustomTable";

-- DropTable
DROP TABLE "CustomTableRow";

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
