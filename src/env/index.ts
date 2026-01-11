import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.url().startsWith('postgresql://'),
})

const _env = envSchema.safeParse(Bun.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', z.flattenError(_env.error))

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
