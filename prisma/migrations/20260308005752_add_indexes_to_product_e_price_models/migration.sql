/*
  Warnings:

  - Added the required column `organizationsId` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "organizationsId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "prices_organizationsId_productId_idx" ON "prices"("organizationsId", "productId");

-- CreateIndex
CREATE INDEX "products_organizationsId_id_idx" ON "products"("organizationsId", "id");

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
