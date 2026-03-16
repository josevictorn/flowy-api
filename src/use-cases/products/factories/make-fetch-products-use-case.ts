import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { FetchProductsUseCase } from '../fetch-products'

export function makeFetchProductsUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()
  const useCase = new FetchProductsUseCase(
    productsRepository,
    organizationsRepository
  )

  return useCase
}
