import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  BillingInterval,
  BillingScheme,
  type Price,
} from '../../../generated/prisma/client'

export function makePriceWithPerUnitBilling(overrides?: Partial<Price>) {
  const price = {
    id: crypto.randomUUID(),
    productId: crypto.randomUUID(),
    billingScheme: BillingScheme.ONE_TIME,
    unitAmount: faker.number.int({ min: 100, max: 10_000 }),
    currency: 'brl',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }

  return price
}

export function makePriceWithRecurringBilling(overrides?: Partial<Price>) {
  const price = {
    id: crypto.randomUUID(),
    productId: crypto.randomUUID(),
    billingScheme: BillingScheme.RECURRING,
    interval: BillingInterval.MONTHLY,
    unitAmount: faker.number.int({ min: 100, max: 10_000 }),
    currency: 'brl',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }

  return price
}
