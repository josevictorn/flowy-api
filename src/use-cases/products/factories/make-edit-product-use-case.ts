import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository'
import { PrismaProductsRepository } from '@/repositories/prisma/prisma-products-repository'
import { EditProductUseCase } from '../edit-product'

export function makeEditProductUseCase() {
  const productsRepository = new PrismaProductsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()
  const useCase = new EditProductUseCase(
    productsRepository,
    organizationsRepository
  )

  return useCase
}
