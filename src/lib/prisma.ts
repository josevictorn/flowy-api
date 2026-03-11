import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

export const createPrisma = () => {
  const connectionString = `${Bun.env.DATABASE_URL}`
  const schema = Bun.env.DATABASE_SCHEMA || 'public'

  const adapter = new PrismaPg({ connectionString }, { schema })

  return new PrismaClient({ adapter })
}

export const prisma = createPrisma()
