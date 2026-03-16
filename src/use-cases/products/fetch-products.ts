import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type {
  ProductsRepository,
  ProductWithPrices,
} from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

interface FetchProductsRequest {
  organizationId: string
  page: number
}

type FetchProductsResponse = Either<
  OrganizationNotFoundError,
  { products: ProductWithPrices[] }
>

export class FetchProductsUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository
  ) {}

  async execute({
    organizationId,
    page,
  }: FetchProductsRequest): Promise<FetchProductsResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      return left(new OrganizationNotFoundError())
    }

    const products = await this.productsRepository.findManyByOrganizationId(
      organizationId,
      page
    )

    return right({ products })
  }
}
