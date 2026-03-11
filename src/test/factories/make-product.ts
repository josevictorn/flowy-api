import { faker } from '@faker-js/faker/locale/pt_BR'
import type { Product } from '../../../generated/prisma/client'

export function makeProduct(overrides?: Partial<Product>) {
  const product = {
    id: crypto.randomUUID(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    organizationId: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }

  return product
}
