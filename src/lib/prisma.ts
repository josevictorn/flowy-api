import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

export const createPrisma = () => {
  const connectionString = `${Bun.env.DATABASE_URL}`

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({ adapter })
}

export let prisma = createPrisma()

export const refreshPrismaInstance = () => {
  prisma = createPrisma()
}
