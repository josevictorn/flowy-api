import cors from '@elysiajs/cors'
import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { env } from './env'
import { CreateProductController } from './http/controllers/products/create'
import { EditProductController } from './http/controllers/products/edit'
import { GetProductController } from './http/controllers/products/get'
import { InactivateProductController } from './http/controllers/products/inactivate'
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
  .use(CreateProductController)
  .use(GetProductController)
  .use(EditProductController)
  .use(InactivateProductController)

export { app }
