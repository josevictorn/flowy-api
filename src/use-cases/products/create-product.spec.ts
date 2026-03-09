import { beforeEach, describe, expect, it } from 'bun:test'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { makeOrganization } from '@/test/factories/make-organization'
import { CreateProductUseCase } from './create-product'

let productRepository: InMemoryProductsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: CreateProductUseCase

describe('Create Product Use Case', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateProductUseCase(productRepository, organizationsRepository)
  })

  it('should be able to create a new product with one-time payment', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      name: 'Product 1',
      description: 'Description of Product 1',
      billingScheme: 'ONE_TIME',
      unitAmount: 100,
      currency: 'BRL',
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: expect.any(String),
        name: 'Product 1',
        description: 'Description of Product 1',
        organizationsId: organization.id,
      },
      price: {
        id: expect.any(String),
        billingScheme: 'ONE_TIME',
        interval: null,
        unitAmount: 100,
        currency: 'BRL',
        organizationsId: organization.id,
      },
    })
  })

  it('should be able to create a new product with recurring payment', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      name: 'Product 1',
      description: 'Description of Product 1',
      billingScheme: 'RECURRING',
      interval: 'MONTHLY',
      unitAmount: 100,
      currency: 'BRL',
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: expect.any(String),
        name: 'Product 1',
        description: 'Description of Product 1',
        organizationsId: organization.id,
      },
      price: {
        id: expect.any(String),
        billingScheme: 'RECURRING',
        interval: 'MONTHLY',
        unitAmount: 100,
        currency: 'BRL',
        organizationsId: organization.id,
      },
    })
  })

  it('should not be able to create a new product with non existing organization', async () => {
    const result = await sut.execute({
      name: 'Product 1',
      description: 'Description of Product 1',
      billingScheme: 'ONE_TIME',
      unitAmount: 100,
      currency: 'BRL',
      organizationId: 'non-existing-organization-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe('OrganizationNotFoundError')
  })

  it('should not be able to create a new product with recurring billing scheme without interval', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      name: 'Product 1',
      description: 'Description of Product 1',
      billingScheme: 'RECURRING',
      unitAmount: 100,
      currency: 'BRL',
      organizationId: organization.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe('IntervalRequiredError')
  })
})
