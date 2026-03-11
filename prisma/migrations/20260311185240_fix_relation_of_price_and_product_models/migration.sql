-- DropForeignKey
ALTER TABLE "prices" DROP CONSTRAINT "prices_organizationsId_fkey";

-- DropForeignKey
ALTER TABLE "prices" DROP CONSTRAINT "prices_productId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_organizationsId_fkey";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
