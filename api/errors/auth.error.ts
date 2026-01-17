import { ApiError } from './api-error';

export class AuthError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'AUTH_UNAUTHORIZED');
  }
}
