import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'
import { randomUUIDv7 } from 'bun'
import { prisma } from './prisma'

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:5173'],
  basePath: '/auth',
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => randomUUIDv7(),
    },
    cookiePrefix: '@flowy-app',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
})
