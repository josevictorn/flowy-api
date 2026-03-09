import { faker } from '@faker-js/faker/locale/pt_BR'
import type { Organizations } from '../../../generated/prisma/client'

export function makeOrganization(overrides?: Partial<Organizations>) {
  const organization = {
    id: crypto.randomUUID(),
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()).toLocaleLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }

  return organization
}
