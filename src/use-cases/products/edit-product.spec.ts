import { beforeEach, describe, expect, it } from 'bun:test'
import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository'
import { InMemoryProductsRepository } from '@/repositories/in-memory/in-memory-products-repository'
import { makeOrganization } from '@/test/factories/make-organization'
import { makeProduct } from '@/test/factories/make-product'
import { EditProductUseCase } from './edit-product'

let productsRepository: InMemoryProductsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: EditProductUseCase

describe('Edit Product Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new EditProductUseCase(productsRepository, organizationsRepository)
  })

  it('should be able to edit a product', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    await organizationsRepository.create(organization)
    await productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
      name: 'Updated Product Name',
      description: 'Updated Product Description',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: product.id,
        name: 'Updated Product Name',
        description: 'Updated Product Description',
        organizationsId: organization.id,
      },
    })
  })

  it('should be able to edit a product with only name', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    await organizationsRepository.create(organization)
    await productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
      name: 'Updated Product Name',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: product.id,
        name: 'Updated Product Name',
        description: product.description,
        organizationsId: organization.id,
      },
    })
  })

  it('should be able to edit a product with only description', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    await organizationsRepository.create(organization)
    await productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organization.id,
      description: 'Updated Product Description',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: {
        id: product.id,
        name: product.name,
        description: 'Updated Product Description',
        organizationsId: organization.id,
      },
    })
  })

  it('should be able to edit a product without changes', async () => {
    const organization = makeOrganization()
    const product = makeProduct({ organizationsId: organization.id })

    await organizationsRepository.create(organization)
    await productsRepository.create(product)

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
      },
    })
  })

  it('should not be able to edit a product with non existing organization', async () => {
    const product = makeProduct({ organizationsId: 'org-id' })
    await productsRepository.create(product)

    const result = await sut.execute({
      productId: 'non-existing-id',
      organizationId: 'non-existing-id',
      name: 'Updated Product Name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe('OrganizationNotFoundError')
  })

  it('should not be able to edit a non existing product', async () => {
    const organization = makeOrganization()

    await organizationsRepository.create(organization)

    const result = await sut.execute({
      productId: 'non-existing-id',
      organizationId: organization.id,
      name: 'Updated Product Name',
      description: 'Updated Product Description',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe('ProductNotFoundError')
  })

  it('should not be able to edit a product from another organization', async () => {
    const organizationA = makeOrganization()
    const organizationB = makeOrganization()
    await organizationsRepository.create(organizationA)
    await organizationsRepository.create(organizationB)

    const product = makeProduct({ organizationsId: organizationA.id })
    await productsRepository.create(product)

    const result = await sut.execute({
      productId: product.id,
      organizationId: organizationB.id,
      name: 'New Name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value.constructor.name).toBe('ProductNotFoundError')
  })
})
