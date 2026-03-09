import type { Organizations } from '../../../generated/prisma/client'
import type { OrganizationsUncheckedCreateInput } from '../../../generated/prisma/models'
import type { OrganizationsRepository } from '../organizations-repository'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  private readonly organizations: Organizations[] = []

  findById(id: string) {
    const organization = this.organizations.find(
      (organization) => organization.id === id
    )

    if (!organization) {
      return Promise.resolve(null)
    }

    return Promise.resolve(organization)
  }

  create(data: OrganizationsUncheckedCreateInput): Promise<Organizations> {
    const organization = {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      logo: data.logo ?? null,
      metadata: data.metadata ?? null,
      slug: data.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.organizations.push(organization)

    return Promise.resolve(organization)
  }
}
