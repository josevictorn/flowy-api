import Elysia from 'elysia'
import z from 'zod'
import { betterAuthPlugin } from '@/http/plugins/better-auth'
import { ProductPresenter } from '@/http/presenters/product-presenter'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { ProductNotFoundError } from '@/use-cases/errors/product-not-found-error'
import { makeGetProductUseCase } from '@/use-cases/products/factories/make-get-product-use-case'
import {
  BillingInterval,
  BillingScheme,
} from '../../../../generated/prisma/enums'

export const GetProductController = new Elysia().use(betterAuthPlugin).get(
  '/products/:id',
  async ({ params, set, session }) => {
    const { id } = params

    const getProductUseCase = makeGetProductUseCase()

    const result = await getProductUseCase.execute({
      productId: id,
      organizationId: session?.activeOrganizationId ?? '',
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProductNotFoundError:
          set.status = 404
          return { message: error.message }
        case OrganizationNotFoundError:
          set.status = 404
          return { message: error.message }
        default:
          throw new Error(error.message)
      }
    }

    set.status = 200
    return {
      product: ProductPresenter.toHTTP(result.value.product),
    }
  },
  {
    auth: true,
    detail: {
      summary: 'Get Product',
      description: 'Get a product by its ID',
      tags: ['Products'],
    },
    body: z.void(),
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({
        product: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          active: z.boolean(),
          organizationsId: z.string(),
          createdAt: z.iso.datetime(),
          updatedAt: z.iso.datetime(),
          prices: z.array(
            z.object({
              id: z.string(),
              billingScheme: z.enum(BillingScheme),
              interval: z.enum(BillingInterval).nullable(),
              unitAmount: z.number(),
              currency: z.string(),
              organizationsId: z.string(),
              productId: z.string(),
              createdAt: z.iso.datetime(),
              updatedAt: z.iso.datetime(),
            })
          ),
        }),
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
