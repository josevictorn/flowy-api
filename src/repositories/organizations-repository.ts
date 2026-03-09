import type { Organizations, Prisma } from '../../generated/prisma/client'

export interface OrganizationsRepository {
  findById(id: string): Promise<Organizations | null>
  create(data: Prisma.OrganizationsUncheckedCreateInput): Promise<Organizations>
}
