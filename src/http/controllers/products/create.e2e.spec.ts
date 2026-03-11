import { beforeAll, describe, expect, it } from 'bun:test'
import type { app as AppType } from '@/app'
import { env } from '@/env'
import { makePriceWithPerUnitBilling } from '@/test/factories/make-price'
import { makeProduct } from '@/test/factories/make-product'

describe('Create Product Controller (E2E)', () => {
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

  it('should be able to create a new product', async () => {
    const authenticateUser = await makeAuthenticateUser()
    const authCookie = authenticateUser.headers.get('set-cookie') ?? ''

    const product = makeProduct()
    const price = makePriceWithPerUnitBilling()

    const response = await app.handle(
      new Request(`${env.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          billingScheme: price.billingScheme,
          unitAmount: price.unitAmount,
          currency: price.currency,
        }),
      })
    )

    const { product: createdProduct, price: createdPrice } =
      await response.json()

    expect(response.status).toBe(201)
    expect(createdProduct).toEqual(
      expect.objectContaining({
        id: createdProduct.id,
        name: product.name,
        description: product.description,
        organizationsId: expect.any(String),
      })
    )
    expect(createdPrice).toEqual(
      expect.objectContaining({
        id: createdPrice.id,
        billingScheme: price.billingScheme,
        unitAmount: price.unitAmount,
        currency: price.currency,
      })
    )
  })
})
