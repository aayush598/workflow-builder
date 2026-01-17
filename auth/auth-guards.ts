import { getAuthContext } from './auth-context';

export async function requireAuth() {
  return await getAuthContext();
}
