import type { ProductWithPrices } from '@/repositories/products-repository'

export class ProductPresenter {
  static toHTTP(product: ProductWithPrices) {
    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      prices: product.prices.map((price) => ({
        ...price,
        createdAt: price.createdAt.toISOString(),
        updatedAt: price.updatedAt.toISOString(),
      })),
    }
  }
}
