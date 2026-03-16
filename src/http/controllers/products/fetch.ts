import Elysia from 'elysia'
import z from 'zod'
import { betterAuthPlugin } from '@/http/plugins/better-auth'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { makeFetchProductsUseCase } from '@/use-cases/products/factories/make-fetch-products-use-case'
import {
  BillingInterval,
  BillingScheme,
} from '../../../../generated/prisma/enums'

export const FetchProductsController = new Elysia().use(betterAuthPlugin).get(
  '/products',
  async ({ query, set, session }) => {
    const { page = 1 } = query

    const fetchProductsUseCase = makeFetchProductsUseCase()

    const result = await fetchProductsUseCase.execute({
      organizationId: session?.activeOrganizationId ?? '',
      page: Number(page),
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrganizationNotFoundError:
          set.status = 404
          return { message: error.message }
        default:
          throw new Error(error.message)
      }
    }

    set.status = 200
    return result.value
  },
  {
    auth: true,
    detail: {
      summary: 'Fetch Products',
      description: 'Fetch products with pagination',
      tags: ['Products'],
    },
    body: z.void(),
    query: z.object({
      page: z.string().optional(),
    }),
    response: {
      200: z.object({
        products: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            active: z.boolean(),
            organizationsId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            prices: z.array(
              z.object({
                id: z.string(),
                billingScheme: z.enum(BillingScheme),
                interval: z.enum(BillingInterval).nullable(),
                unitAmount: z.number().nullable(),
                currency: z.string().nullable(),
                organizationsId: z.string(),
                productId: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          })
        ),
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
