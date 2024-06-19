import fetchClient from './fetch-client';

export async function resetPassword(
  apiBaseUrl: string,
  newPassword: string,
  token: string,
) {
  const url = new URL(`${apiBaseUrl}/reset-password`);
  const response = await fetchClient({
    method: 'POST',
    url,
    body: JSON.stringify({
      password: newPassword,
      token,
    }),
  });
  return response;
}
