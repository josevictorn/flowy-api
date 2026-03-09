import type { UseCaseError } from '@/errors/use-case-error'

export class IntervalRequiredError extends Error implements UseCaseError {
  constructor() {
    super('Interval is required for recurring billing')
  }
}
