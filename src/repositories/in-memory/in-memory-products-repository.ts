import type { Price, Prisma, Product } from '../../../generated/prisma/client'
import type { ProductsRepository } from '../products-repository'

export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: (Product & { price?: Price })[] = []
  private readonly prices: Price[] = []

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    const product = {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      active: data.active ?? true,
      description: data.description ?? null,
      organizationsId: data.organizationsId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.products.push(product)

    return product
  }

  async createWithPrice(
    productData: Prisma.ProductUncheckedCreateInput,
    priceData: Omit<Prisma.PriceUncheckedCreateInput, 'productId'> & {
      productId?: string
    }
  ) {
    const productId = productData.id ?? crypto.randomUUID()
    const organizationId =
      productData.organizationsId ??
      priceData.organizationsId ??
      crypto.randomUUID()

    const product: Product & { price?: Price } = {
      id: productId,
      name: productData.name,
      active: productData.active ?? true,
      description: productData.description ?? null,
      organizationsId: organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const price: Price = {
      id: priceData.id ?? crypto.randomUUID(),
      billingScheme: priceData.billingScheme,
      interval: priceData.interval ?? null,
      unitAmount: priceData.unitAmount ?? 0,
      currency: priceData.currency ?? 'usd',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId,
      organizationsId: organizationId,
    }

    await this.prices.push(price)
    product.price = price
    await this.products.push(product)

    return { product, price }
  }
}
