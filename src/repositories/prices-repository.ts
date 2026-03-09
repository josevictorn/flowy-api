import type { Price, Prisma } from '../../generated/prisma/client'

export interface PricesRepository {
  create(data: Prisma.PriceUncheckedCreateInput): Promise<Price>
}
