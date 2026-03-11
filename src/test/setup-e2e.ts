import { afterAll, beforeAll } from 'bun:test'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { prisma, refreshPrismaInstance } from '@/lib/prisma'

const schemaName = `test_${randomUUID().replace(/-/g, '_')}`

beforeAll(() => {
  const url = new URL(Bun.env.DATABASE_URL || 'test')
  url.searchParams.set('schema', schemaName)

  Bun.env.DATABASE_URL = url.toString()
  Bun.env.DATABASE_SCHEMA = schemaName

  execSync('bunx prisma db push', {
    env: { ...Bun.env },
  })

  refreshPrismaInstance()
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`
  )
  await prisma.$disconnect()
})
