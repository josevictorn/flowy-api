import { afterEach, beforeEach } from 'bun:test'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  const url = new URL(Bun.env.DATABASE_URL ?? '')
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const databaseURL = generateUniqueDatabaseURL(schemaId)

process.env.DATABASE_URL = databaseURL
process.env.DATABASE_SCHEMA = schemaId

const adapter = new PrismaPg(
  { connectionString: databaseURL },
  { schema: schemaId }
)

export const prisma = new PrismaClient({
  adapter,
})

beforeEach(() => {
  execSync('bunx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
  })
})

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
