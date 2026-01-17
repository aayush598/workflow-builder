import { getAuthContext } from './auth-context';
import { userRepository } from '@/database/repositories/user.repository';
import { prisma } from '@/lib/prisma';

export async function requireAuth() {
  const { userId: clerkId } = await getAuthContext();

  let user = await userRepository.findByClerkId(prisma, clerkId);

  if (!user) {
    user = await userRepository.upsertByClerkId(prisma, {
      clerkId,
    });
  }

  return { userId: user.id, clerkId };
}
