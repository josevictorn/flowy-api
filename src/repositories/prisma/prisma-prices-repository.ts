import { prisma } from '@/lib/prisma'
import type { PriceUncheckedCreateInput } from '../../../generated/prisma/models'
import type { PricesRepository } from '../prices-repository'

export class PrismaPricesRepository implements PricesRepository {
  async create(data: PriceUncheckedCreateInput) {
    const price = await prisma.price.create({
      data,
    })

    return price
  }

  async findByProductId(productId: string) {
    const price = await prisma.price.findFirst({
      where: {
        productId,
      },
    })

    return price
  }
}
