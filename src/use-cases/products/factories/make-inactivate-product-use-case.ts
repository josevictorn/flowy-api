import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { InactivateProductUseCase } from '../inactivate-product'

export function makeInactivateProductUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()
  const useCase = new InactivateProductUseCase(
    productsRepository,
    organizationsRepository
  )

  return useCase
}
