import fetchClient from '@/lib/fetch-client';

export async function resendEmail(apiBaseUrl: string) {
  try {
    const response = await fetchClient({
      method: 'POST',
      url: apiBaseUrl + '/resend-email',
    });

    if (!response.ok) {
      throw response;
    }

    const data: boolean = (await response.json()) as boolean;
    return data;
  } catch (error) {
    if (error instanceof Response) {
      return null;
    }
    throw new Error('An error has occurred during sending email');
  }
}
