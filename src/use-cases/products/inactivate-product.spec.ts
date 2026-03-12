import { beforeEach, describe, expect, it } from 'bun:test'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { makeOrganization } from '@/test/factories/make-organization'
import { makeProduct } from '@/test/factories/make-product'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'
import { InactivateProductUseCase } from './inactivate-product'

let productsRepository: InMemoryProductsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: InactivateProductUseCase
describe('Inactive Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new InactivateProductUseCase(
      productsRepository,
      organizationsRepository
    )
  })

  it('should be able to inactive a product', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    organizationsRepository.create(organization)
    productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(productsRepository.products[0].active).toBe(false)
  })

  it('should not be able to inactive a product with wrong organization id', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    organizationsRepository.create(organization)
    productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: 'non-existing-organization-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrganizationNotFoundError)
    expect(productsRepository.products[0].active).toBe(true)
  })

  it('should not be able to inactive a non existing product', async () => {
    const organization = makeOrganization()

    organizationsRepository.create(organization)

    const result = await sut.execute({
      productId: 'non-existing-product-id',
      organizationId: organization.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductNotFoundError)
  })

  it('should not be able to inactive a product that belongs to another organization', async () => {
    const orgA = makeOrganization()
    const orgB = makeOrganization()
    const product = makeProduct({ organizationsId: orgA.id })

    organizationsRepository.create(orgA)
    organizationsRepository.create(orgB)
    productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: orgB.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ProductNotFoundError)
    expect(productsRepository.products[0].active).toBe(true)
  })

  it('should be idempotent when product is already inactive', async () => {
    const organization = makeOrganization()
    const product = makeProduct({
      organizationsId: organization.id,
      active: false,
    })

    organizationsRepository.create(organization)
    productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(productsRepository.products[0].active).toBe(false)
  })
})
