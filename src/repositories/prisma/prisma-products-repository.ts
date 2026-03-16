import { prisma } from '@/lib/prisma'
import type {
  PriceUncheckedCreateInput,
  ProductUncheckedCreateInput,
} from '../../../generated/prisma/models'
import type { ProductsRepository } from '../products-repository'

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: ProductUncheckedCreateInput) {
    const product = await prisma.product.create({
      data,
    })

    return product
  }

  async createWithPrice(
    productData: ProductUncheckedCreateInput,
    priceData: Omit<PriceUncheckedCreateInput, 'productId'> & {
      productId?: string
    }
  ) {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: productData })
      const price = await tx.price.create({
        data: { ...priceData, productId: product.id },
      })

      return { product, price }
    })

    return { product: result.product, price: result.price }
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        prices: true,
      },
    })

    return product
  }

  async findManyByOrganizationId(organizationsId: string, page: number) {
    const products = await prisma.product.findMany({
      where: {
        organizationsId,
      },
      include: {
        prices: true,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return products
  }

  async save(data: ProductUncheckedCreateInput) {
    const product = await prisma.product.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    })

    return product
  }
}
