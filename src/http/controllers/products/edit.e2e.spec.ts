import { beforeAll, describe, expect, it } from 'bun:test'
import type { app as AppType } from '@/app'
import { env } from '@/env'

describe('Edit Product Controller (E2E)', () => {
  let app: typeof AppType
  let makeAuthenticateUser: () => Promise<Response>

  beforeAll(async () => {
    const authFactory = await import(
      '@/test/factories/make-authenticate-user.js'
    )
    const module = await import('@/app')

    makeAuthenticateUser = authFactory.makeAuthenticateUser
    app = module.app
  })

  it('should be able to edit an existing product', async () => {
    const authenticateUser = await makeAuthenticateUser()
    const authCookie = authenticateUser.headers.get('set-cookie') ?? ''

    const createResponse = await app.handle(
      new Request(`${env.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Product to be edited',
          description: 'This product will be edited in the test',
          billingScheme: 'ONE_TIME',
          unitAmount: 1000,
          currency: 'brl',
        }),
      })
    )

    const { product } = await createResponse.json()

    const editResponse = await app.handle(
      new Request(`${env.BASE_URL}/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Edited Product Name',
          description: 'Edited Product Description',
        }),
      })
    )

    const { product: editedProduct } = await editResponse.json()

    expect(editResponse.status).toBe(200)
    expect(editedProduct).toEqual(
      expect.objectContaining({
        id: product.id,
        name: 'Edited Product Name',
        description: 'Edited Product Description',
        organizationsId: expect.any(String),
        active: true,
      })
    )
  })
})
