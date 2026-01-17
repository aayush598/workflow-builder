import { auth } from './clerk';
import { UnauthorizedError } from './auth-errors';

export type AuthContext = {
  userId: string;
};

export async function getAuthContext(): Promise<AuthContext> {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  return { userId };
}
