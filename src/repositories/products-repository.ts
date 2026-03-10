import type { Price, Prisma, Product } from '../../generated/prisma/client'

export type ProductWithPrices = Prisma.ProductGetPayload<{
  include: { prices: true }
}>

export interface ProductsRepository {
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>
  createWithPrice(
    productData: Prisma.ProductUncheckedCreateInput,
    priceData: Omit<Prisma.PriceUncheckedCreateInput, 'productId'> & {
      productId?: string
    }
  ): Promise<{ product: Product; price: Price }>
  findById(id: string): Promise<ProductWithPrices | null>
}
