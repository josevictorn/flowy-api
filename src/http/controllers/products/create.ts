import Elysia from 'elysia'
import z from 'zod'
import { betterAuthPlugin } from '@/http/plugins/better-auth'
import { IntervalRequiredError } from '@/use-cases/errors/interval-required-error'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { makeCreateProductUseCase } from '@/use-cases/products/factories/make-create-product-use-case'
import {
  BillingInterval,
  BillingScheme,
} from '../../../../generated/prisma/enums'

export const createProduct = new Elysia().use(betterAuthPlugin).post(
  '/products',
  async ({ body, set, session }) => {
    const { name, description, billingScheme, interval, unitAmount, currency } =
      body

    const createProductUseCase = makeCreateProductUseCase()

    const result = await createProductUseCase.execute({
      name,
      description,
      billingScheme,
      interval,
      unitAmount,
      currency,
      organizationId: session?.activeOrganizationId ?? '',
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrganizationNotFoundError:
          set.status = 404
          return { message: error.message }
        case IntervalRequiredError:
          set.status = 400
          return { message: error.message }
        default:
          throw new Error(error.message)
      }
    }

    set.status = 201
    return result.value
  },
  {
    auth: true,
    detail: {
      tags: ['Products'],
    },
    body: z.object({
      name: z.string(),
      description: z.string(),
      billingScheme: z.enum(BillingScheme),
      interval: z.enum(BillingInterval).optional(),
      unitAmount: z.number(),
      currency: z.string(),
    }),
    response: {
      201: z.object({
        product: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          organizationsId: z.string(),
        }),
        price: z.object({
          id: z.string(),
          billingScheme: z.enum(BillingScheme),
          interval: z.enum(BillingInterval).nullable(),
          unitAmount: z.number(),
          currency: z.string(),
          organizationsId: z.string(),
        }),
      }),
      400: z.object({
        message: z.string(),
      }),
      404: z.object({
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
  }
)
