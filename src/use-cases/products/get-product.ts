import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PricesRepository } from '@/repositories/prices-repository'
import type { ProductsRepository } from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import type { Price, Product } from '../../../generated/prisma/client'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'

interface GetProductRequest {
  productId: string
  organizationId: string
}

type GetProductResponse = Either<
  OrganizationNotFoundError | ProductNotFoundError,
  { product: Product; price: Price | null }
>

export class GetProductUseCase {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly pricesRepository: PricesRepository
  ) {}

  async execute({
    productId,
    organizationId,
  }: GetProductRequest): Promise<GetProductResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      return left(new OrganizationNotFoundError())
    }

    const product = await this.productRepository.findById(productId)

    if (!product || product.organizationsId !== organizationId) {
      return left(new ProductNotFoundError())
    }

    const price = await this.pricesRepository.findByProductId(productId)

    return right({ product, price })
  }
}
