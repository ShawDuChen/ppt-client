import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { auth } from './auth';

interface fetchServerProps {
  method?: string;
  url: string | URL;
  body?: string;
}

async function fetchServer({
  method = 'GET',
  url,
  body = '',
}: fetchServerProps) {
  try {
    const session = await auth();

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + session?.accessToken,
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
        return redirect('/auth/login');
      }

      if (error.status === 403) {
        throw new Error('You are not authorized to access this resource', {
          cause: error,
        });
      }

      if (error.status === 404) {
        notFound();
      }
    }

    throw new Error('Failed to fetch data from the server', { cause: error });
  }
}

export default fetchServer;
