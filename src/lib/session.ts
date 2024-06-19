import 'server-only';

import { auth } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function getCurrentUserToken() {
  const session = await auth();
  return session?.accessToken;
}
