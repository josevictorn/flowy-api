import { beforeAll, describe, expect, it } from 'bun:test'
import type { app as AppType } from '@/app'
import { env } from '@/env'
import {
  makePriceWithPerUnitBilling,
  makePriceWithRecurringBilling,
} from '@/test/factories/make-price'
import { makeProduct } from '@/test/factories/make-product'

describe('Fetch Products Controller (E2E)', () => {
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

  it('should be able to fetch products with pagination', async () => {
    const authenticateUser = await makeAuthenticateUser()
    const authCookie = authenticateUser.headers.get('set-cookie') ?? ''

    const product1 = makeProduct()
    const priceProduct1 = makePriceWithPerUnitBilling()
    const product2 = makeProduct()
    const priceProduct2 = makePriceWithRecurringBilling()

    const createProductResponse1 = await app.handle(
      new Request(`${env.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product1.name,
          description: product1.description,
          billingScheme: priceProduct1.billingScheme,
          unitAmount: priceProduct1.unitAmount,
          currency: priceProduct1.currency,
        }),
      })
    )

    const createProductResponse2 = await app.handle(
      new Request(`${env.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product2.name,
          description: product2.description,
          billingScheme: priceProduct2.billingScheme,
          interval: priceProduct2.interval,
          unitAmount: priceProduct2.unitAmount,
          currency: priceProduct2.currency,
        }),
      })
    )

    const { product: createdProduct1, price: createdPrice1 } =
      await createProductResponse1.json()
    const { product: createdProduct2, price: createdPrice2 } =
      await createProductResponse2.json()

    const response = await app.handle(
      new Request(`${env.BASE_URL}/products?page=1`, {
        method: 'GET',
        headers: {
          cookie: authCookie,
          'Content-Type': 'application/json',
        },
      })
    )

    const responseBody = await response.json()

    expect(response.status).toBe(200)

    expect(responseBody.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdProduct1.id,
          name: product1.name,
          description: product1.description,
          organizationsId: expect.any(String),
          prices: expect.arrayContaining([
            expect.objectContaining({
              id: createdPrice1.id,
              billingScheme: priceProduct1.billingScheme,
              unitAmount: priceProduct1.unitAmount,
              currency: priceProduct1.currency,
            }),
          ]),
        }),
        expect.objectContaining({
          id: createdProduct2.id,
          name: product2.name,
          description: product2.description,
          organizationsId: expect.any(String),
          prices: expect.arrayContaining([
            expect.objectContaining({
              id: createdPrice2.id,
              billingScheme: priceProduct2.billingScheme,
              interval: priceProduct2.interval,
              unitAmount: priceProduct2.unitAmount,
              currency: priceProduct2.currency,
            }),
          ]),
        }),
      ])
    )
  })
})
