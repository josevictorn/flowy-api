import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { ProductsRepository } from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import type { Product } from '../../../generated/prisma/client'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'

interface EditProductRequest {
  productId: string
  name?: string
  description?: string
  organizationId: string
}

type EditProductResponse = Either<
  ProductNotFoundError | OrganizationNotFoundError,
  { product: Product }
>

export class EditProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository
  ) {}

  async execute({
    productId,
    name,
    description,
    organizationId,
  }: EditProductRequest): Promise<EditProductResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      return left(new OrganizationNotFoundError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product || product.organizationsId !== organizationId) {
      return left(new ProductNotFoundError())
    }

    product.name = name ?? product.name
    product.description = description ?? product.description

    const editedProduct = await this.productsRepository.save(product)

    return right({ product: editedProduct })
  }
}
