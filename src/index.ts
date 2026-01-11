import openapi from '@elysiajs/openapi'
import { Elysia } from 'elysia'
import { env } from './env'

const app = new Elysia()
  .use(openapi())
  .get('/', () => 'Hello Elysia')
  .listen(env.PORT)

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
)
