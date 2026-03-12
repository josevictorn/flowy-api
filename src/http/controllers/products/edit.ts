import Elysia from 'elysia'
import z from 'zod'
import { betterAuthPlugin } from '@/http/plugins/better-auth'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { ProductNotFoundError } from '@/use-cases/errors/product-not-found-error'
import { makeEditProductUseCase } from '@/use-cases/products/factories/make-edit-product-use-case'

export const EditProductController = new Elysia().use(betterAuthPlugin).patch(
  '/products/:id',
  async ({ body, params, set, session }) => {
    const { name, description } = body
    const { id } = params

    const editProductUseCase = makeEditProductUseCase()

    const result = await editProductUseCase.execute({
      productId: id,
      name,
      description,
      organizationId: session?.activeOrganizationId ?? '',
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrganizationNotFoundError:
          set.status = 404
          return { message: error.message }
        case ProductNotFoundError:
          set.status = 404
          return { message: error.message }
        default:
          throw new Error(error.message)
      }
    }

    return result.value
  },
  {
    auth: true,
    detail: {
      summary: 'Edit Product',
      description: 'Edit an existing product',
      tags: ['Products'],
    },
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
    response: {
      200: z.object({
        product: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
          organizationsId: z.string(),
          active: z.boolean(),
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
