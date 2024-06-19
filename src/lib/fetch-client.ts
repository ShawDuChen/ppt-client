import { getSession, signOut } from 'next-auth/react';
import { getCurrentUserToken, setCurrentUserToken } from './token-storage';
import { jwtDecode } from 'jwt-decode';

interface fetchClientProps {
  method?: string;
  url: string | URL;
  body?: string;
  token?: string;
}

async function fetchClient({
  method = 'GET',
  url,
  body = '',
  token,
}: fetchClientProps) {
  try {
    const localToken = getCurrentUserToken();
    const accessToken = token ?? localToken;

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      body: body || undefined,
    });

    if (!response.ok) {
      throw response;
    }

    return response;
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        await signOut();
        setCurrentUserToken(null);
      }

      if (error.status === 409) {
        window.location.href = '/auth/verify/email';
      }

      throw error;
    }

    console.log('fetchClient error', error);

    throw new Error('Failed to fetch data', { cause: error });
  }
}

export default fetchClient;
