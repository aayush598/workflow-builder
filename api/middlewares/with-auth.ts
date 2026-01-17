import { requireAuth } from '@/auth/auth-guards';

type Handler = (
  req: Request,
  context?: unknown
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    requireAuth();
    return handler(req, context);
  };
}
