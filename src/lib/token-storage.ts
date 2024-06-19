export function getCurrentUserToken() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return null;
  }
  return JSON.parse(token) as string;
}

export function setCurrentUserToken(token: string | null) {
  localStorage.setItem('accessToken', JSON.stringify(token));
}
