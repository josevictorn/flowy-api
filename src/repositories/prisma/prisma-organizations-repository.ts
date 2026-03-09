import { prisma } from '@/lib/prisma'
import type { OrganizationsUncheckedCreateInput } from '../../../generated/prisma/models'
import type { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findById(id: string) {
    const organization = await prisma.organizations.findUnique({
      where: {
        id,
      },
    })

    return organization
  }

  async create(data: OrganizationsUncheckedCreateInput) {
    const organization = await prisma.organizations.create({
      data,
    })

    return organization
  }
}
