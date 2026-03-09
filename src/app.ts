import cors from '@elysiajs/cors'
import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { env } from './env'
import { createProduct } from './http/controllers/products/create'
import { betterAuthPlugin, OpenAPI } from './http/plugins/better-auth'

const app = new Elysia()
  .use(
    cors({
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .error({})
  .onError(({ code, error, status }) => {
    switch (code) {
      case 'VALIDATION': {
        console.log(error)

        return { code, message: error.all }
      }
      default: {
        console.error(error)

        return status(500, { message: 'Internal Server Error' })
      }
    }
  })
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(betterAuthPlugin)
  .use(createProduct)
  .get(
    '/users/:id',
    ({ params, user }) => {
      const userId = params.id

      const authenticatedUser = user.name

      console.log({ authenticatedUser })

      return {
        id: userId,
        name: authenticatedUser,
      }
    },
    {
      auth: true,
      detail: {
        description: 'Get user by ID',
        tags: ['User'],
      },
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
        }),
      },
    }
  )

export { app }
