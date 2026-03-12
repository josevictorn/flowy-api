import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { ProductsRepository } from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'

interface InactivateProductUseCaseRequest {
  productId: string
  organizationId: string
}

type InactivateProductUseCaseResponse = Either<
  ProductNotFoundError | OrganizationNotFoundError,
  null
>

export class InactivateProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository
  ) {}

  async execute({
    productId,
    organizationId,
  }: InactivateProductUseCaseRequest): Promise<InactivateProductUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      return left(new OrganizationNotFoundError())
    }

    const product = await this.productsRepository.findById(productId)

    if (!product || product.organizationsId !== organization.id) {
      return left(new ProductNotFoundError())
    }

    product.active = false

    await this.productsRepository.save(product)

    return right(null)
  }
}
