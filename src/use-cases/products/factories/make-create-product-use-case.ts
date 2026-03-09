import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { CreateProductUseCase } from '../create-product'

export function makeCreateProductUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()
  const productsRepository = new PrismaProductsRepository()
  const useCase = new CreateProductUseCase(
    productsRepository,
    organizationsRepository
  )

  return useCase
}
