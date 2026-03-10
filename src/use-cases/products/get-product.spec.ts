import { beforeEach, describe, expect, it } from 'bun:test'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { makeOrganization } from '@/test/factories/make-organization'
import { makePriceWithPerUnitBilling } from '@/test/factories/make-price'
import { makeProduct } from '@/test/factories/make-product'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'
import { GetProductUseCase } from './get-product'

let productRepository: InMemoryProductsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: GetProductUseCase

describe('Get Product Use Case', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new GetProductUseCase(productRepository, organizationsRepository)
  })

  it('should be able to get a product by id', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })
    const price = makePriceWithPerUnitBilling({
      productId: product.id,
      organizationsId: organization.id,
    })

    await organizationsRepository.create(organization)
    await productRepository.createWithPrice(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        organizationsId: organization.id,
      },
      {
        id: price.id,
        billingScheme: price.billingScheme,
        interval: price.interval,
        unitAmount: price.unitAmount,
        currency: price.currency,
        organizationsId: organization.id,
      }
    )

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        organizationsId: organization.id,
        prices: [
          {
            id: price.id,
            billingScheme: price.billingScheme,
            unitAmount: price.unitAmount,
            currency: price.currency,
            organizationsId: organization.id,
          },
        ],
      },
    })
  })

  it('should not be able to get a product with non existing organization', async () => {
    const result = await sut.execute({
      productId: crypto.randomUUID(),
      organizationId: crypto.randomUUID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe(OrganizationNotFoundError.name)
  })

  it('should not be able to get a non existing product', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      productId: crypto.randomUUID(),
      organizationId: organization.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe(ProductNotFoundError.name)
  })
})
