import { beforeEach, describe, expect, it } from 'bun:test'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { makeOrganization } from '@/test/factories/make-organization'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { FetchProductsUseCase } from './fetch-products'

let productRepository: InMemoryProductsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: FetchProductsUseCase

describe('Fetch Products Use Case', () => {
  beforeEach(() => {
    productRepository = new InMemoryProductsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new FetchProductsUseCase(productRepository, organizationsRepository)
  })

  it('should be able to fetch products by organization id', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    await productRepository.create({
      name: 'Product 1',
      organizationsId: organization.id,
    })

    await productRepository.create({
      name: 'Product 2',
      organizationsId: organization.id,
    })

    const result = await sut.execute({
      organizationId: organization.id,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      products: expect.arrayContaining([
        expect.objectContaining({
          name: 'Product 1',
        }),
        expect.objectContaining({
          name: 'Product 2',
        }),
      ]),
    })
  })

  it('should return an error if organization does not exist', async () => {
    const result = await sut.execute({
      organizationId: 'non-existing-organization-id',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrganizationNotFoundError)
  })

  it('should return an empty array if organization has no products', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      organizationId: organization.id,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      products: [],
    })
  })

  it('should return paginated products', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    for (let i = 1; i <= 25; i++) {
      await productRepository.create({
        name: `Product ${i}`,
        organizationsId: organization.id,
      })
    }

    const result = await sut.execute({
      organizationId: organization.id,
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      products: expect.arrayContaining([
        expect.objectContaining({
          name: 'Product 21',
        }),
        expect.objectContaining({
          name: 'Product 22',
        }),
        expect.objectContaining({
          name: 'Product 23',
        }),
        expect.objectContaining({
          name: 'Product 24',
        }),
        expect.objectContaining({
          name: 'Product 25',
        }),
      ]),
    })
  })
})
