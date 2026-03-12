import Elysia from 'elysia'
import z from 'zod'
import { OrganizationNotFoundError } from '@/use-cases/errors/organization-not-found-error'
import { ProductNotFoundError } from '@/use-cases/errors/product-not-found-error'
import { makeInactivateProductUseCase } from '@/use-cases/products/factories/make-inactivate-product-use-case'
import { betterAuthPlugin } from '../../plugins/better-auth'

export const InactivateProductController = new Elysia()
  .use(betterAuthPlugin)
  .patch(
    '/products/:id/inactivate',
    async ({ params, set, session }) => {
      const { id } = params

      const inactivateProductUseCase = makeInactivateProductUseCase()

      const result = await inactivateProductUseCase.execute({
        productId: id,
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

      set.status = 204
      return null
    },
    {
      auth: true,
      detail: {
        summary: 'Inactivate Product',
        description: 'Inactivate an existing product',
        tags: ['Products'],
      },
      params: z.object({
        id: z.string(),
      }),
      response: {
        204: z.null(),
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
