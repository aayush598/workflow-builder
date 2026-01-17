import { withAuth } from '@/api/middlewares/with-auth';
import { withErrorHandler } from '@/api/middlewares/with-error-handler';
import { successResponse } from '@/api/responses/success.response';
import { requireAuth } from '@/auth/auth-guards';
import { currentUser } from '@/auth/clerk';
import { prisma } from '@/lib/prisma';
import { userRepository } from '@/database/repositories/user.repository';

export const GET = withErrorHandler(
  withAuth(async () => {
    // 1. Auth context (Clerk userId)
    const { clerkId } = await requireAuth();

    // 2. Fetch Clerk user (email, etc.)
    const clerkUser = await currentUser();

    // Clerk guarantees user exists if userId exists
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ?? undefined;

    // 3. Upsert user in DB (lazy provisioning)
    const user = await userRepository.upsertByClerkId(prisma, {
      clerkId,
      email,
    });

    // 4. Return normalized user profile
    return successResponse({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      createdAt: user.createdAt,
    });
  })
);
