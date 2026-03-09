import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { ProductsRepository } from '@/repositories/products-repository'
import { type Either, left, right } from '@/utils/either'
import type { Price, Product } from '../../../generated/prisma/client'
import type {
  BillingInterval,
  BillingScheme,
} from '../../../generated/prisma/enums'
import { IntervalRequiredError } from '../errors/interval-required-error'
import { OrganizationNotFoundError } from '../errors/organization-not-found-error'

interface CreateProductRequest {
  name: string
  description: string
  billingScheme: BillingScheme
  interval?: BillingInterval
  unitAmount: number
  currency: string
  organizationId: string
}

type CreateProductResponse = Either<
  OrganizationNotFoundError | IntervalRequiredError,
  { product: Product; price: Price }
>

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly organizationsRepository: OrganizationsRepository
  ) {}

  async execute({
    name,
    description,
    billingScheme,
    interval,
    unitAmount,
    currency,
    organizationId,
  }: CreateProductRequest): Promise<CreateProductResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      return left(new OrganizationNotFoundError())
    }

    if (billingScheme === 'RECURRING' && !interval) {
      return left(new IntervalRequiredError())
    }

    const product = await this.productRepository.createWithPrice(
      {
        name,
        description,
        organizationsId: organizationId,
      },
      {
        billingScheme,
        interval,
        unitAmount,
        currency,
        organizationsId: organizationId,
      }
    )

    return right({
      product: product.product,
      price: product.price,
    })
  }
}
