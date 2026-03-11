import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.url().startsWith('postgresql://'),
  DATABASE_SCHEMA: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),

  CLIENT_URL: z.url(),

  SMTP_HOST: z.string().min(1).default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.email().default('noreply@flowy.local'),

  BASE_URL: z.url().default('http://localhost:3333'),
})

const _env = envSchema.safeParse(Bun.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', z.flattenError(_env.error))

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
