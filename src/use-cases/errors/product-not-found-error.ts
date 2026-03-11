import type { UseCaseError } from '@/errors/use-case-error'

export class ProductNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Product not found')
  }
}
