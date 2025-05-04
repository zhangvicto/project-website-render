-- CreateTable
CREATE TABLE "CustomTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "CustomTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomTableRow" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tableId" INTEGER NOT NULL,

    CONSTRAINT "CustomTableRow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomTable" ADD CONSTRAINT "CustomTable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomTableRow" ADD CONSTRAINT "CustomTableRow_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "CustomTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
