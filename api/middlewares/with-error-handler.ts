import { ApiError } from '@/api/errors/api-error';
import { errorResponse } from '@/api/responses/error.response';

type Handler = (
  req: Request,
  context?: unknown
) => Promise<Response>;

export function withErrorHandler(handler: Handler): Handler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return errorResponse(error);
      }

      console.error('Unhandled API error:', error);

      return errorResponse(
        new (class extends ApiError {
          constructor() {
            super(
              'Internal server error',
              500,
              'INTERNAL_SERVER_ERROR'
            );
          }
        })()
      );
    }
  };
}
