import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { GetProductUseCase } from '../get-product'

export function makeGetProductUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()
  const useCase = new GetProductUseCase(
    productsRepository,
    organizationsRepository
  )

  return useCase
}
