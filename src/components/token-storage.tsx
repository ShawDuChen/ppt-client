'use client';

import { useLocalStorage } from '@uidotdev/usehooks';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function TokenStorage() {
  const session = useSession();

  const [token, setToken] = useLocalStorage<string | null>('accessToken', null);

  useEffect(() => {
    if (session.data?.accessToken) {
      setToken(session.data.accessToken);
    }
  }, [session.data?.accessToken, setToken]);

  return null;
}
