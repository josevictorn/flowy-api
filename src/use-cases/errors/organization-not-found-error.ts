import type { UseCaseError } from '@/errors/use-case-error'

export class OrganizationNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Organization not found')
  }
}
