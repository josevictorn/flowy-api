import type { Price } from '../../../generated/prisma/client'
import type { PriceUncheckedCreateInput } from '../../../generated/prisma/models'
import type { PricesRepository } from '../prices-repository'

export class InMemoryPricesRepository implements PricesRepository {
  private readonly prices: Price[] = []

  create(data: PriceUncheckedCreateInput): Promise<Price> {
    const price = {
      id: data.id || crypto.randomUUID(),
      billingScheme: data.billingScheme,
      interval: data.interval ?? null,
      unitAmount: data.unitAmount ?? 0,
      currency: data.currency ?? 'brl',
      createdAt: new Date(),
      updatedAt: new Date(),
      productId: data.productId,
      organizationsId: data.organizationsId,
    }

    this.prices.push(price)

    return Promise.resolve(price)
  }

  findByProductId(productId: string) {
    const price = this.prices.find((price) => price.productId === productId)

    if (!price) {
      return Promise.resolve(null)
    }

    return Promise.resolve(price)
  }
}
