import { ApiError } from './api-error';

export class ValidationError extends ApiError {
  public readonly issues?: unknown;

  constructor(message = 'Validation failed', issues?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
    this.issues = issues;
  }
}
