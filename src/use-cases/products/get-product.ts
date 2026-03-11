import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type {
  ProductsRepository,
  ProductWithPrices,
} from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'
import { ProductNotFoundError } from '../errors/product-not-found-error'

interface GetProductRequest {
  productId: string
  organizationId: string
}

type GetProductResponse = Either<
  OrganizationNotFoundError | ProductNotFoundError,
  { product: ProductWithPrices }
>

export class GetProductUseCase {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository
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

    return right({ product })
  }
}
