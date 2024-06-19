import fetchClient from './fetch-client';

export async function sendResetEmail(apiBaseUrl: string, email: string) {
  const url = new URL(
    `${apiBaseUrl}/reset-password` + '?' + new URLSearchParams({ email }),
  );
  const response = await fetchClient({
    url,
  });
  return response;
}
