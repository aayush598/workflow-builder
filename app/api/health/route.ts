import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';

export const GET = withErrorHandler(
  withAuth(async () => {
    return successResponse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  })
);
