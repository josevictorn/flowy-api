import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const connectionString = `${Bun.env.DATABASE_URL}`

const adapter = new PrismaPg(
  { connectionString },
  { schema: Bun.env.DATABASE_SCHEMA }
)

const prisma = new PrismaClient({ adapter })

export { prisma }
