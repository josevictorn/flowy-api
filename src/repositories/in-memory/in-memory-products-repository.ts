import type { Price, Prisma, Product } from '../../../generated/prisma/client'
import type {
  ProductsRepository,
  ProductWithPrices,
} from '../products-repository'

export class InMemoryProductsRepository implements ProductsRepository {
  private readonly products: ProductWithPrices[] = []
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
      prices: [],
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

    const price: Price = {
      id: priceData.id ?? crypto.randomUUID(),
      billingScheme: priceData.billingScheme,
      interval: priceData.interval ?? null,
      unitAmount: priceData.unitAmount ?? 0,
      currency: priceData.currency ?? 'brl',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId,
      organizationsId: organizationId,
    }

    const product = {
      id: productId,
      name: productData.name,
      active: productData.active ?? true,
      description: productData.description ?? null,
      organizationsId: organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      prices: [price],
    }

    await this.prices.push(price)
    await this.products.push(product)

    return { product, price }
  }

  findById(id: string): Promise<ProductWithPrices | null> {
    const product = this.products.find((product) => product.id === id)

    if (!product) {
      return Promise.resolve(null)
    }

    return Promise.resolve(product)
  }
}
