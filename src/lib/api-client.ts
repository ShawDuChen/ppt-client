import { SearchCategory } from '@/types';
import fetchClient from './fetch-client';
import { ChatSession, ChatSessionList } from '@/types/chat';
import { FilterMap } from '@/app/search/(category)/filter-map';

export interface Completion {
  names: string;
  name: {
    cn_name: string;
    en_name: string;
  };
}

// Deprecated
export async function fetchCompletions(
  apiBaseURL: string,
  keyword: string,
): Promise<{
  [key in SearchCategory]: Completion[];
}>;

export async function fetchCompletions(
  apiBaseURL: string,
  keyword: string,
  category: SearchCategory,
): Promise<Completion[]>;

export async function fetchCompletions(
  apiBaseURL: string,
  keyword: string,
  category: SearchCategory,
  field: string,
): Promise<string[]>;

export async function fetchCompletions(
  apiBaseURL: string,
  keyword: string,
  category?: SearchCategory,
  field?: string,
) {
  const searchParams = new URLSearchParams({
    q: keyword,
    category: category ?? '',
  });
  if (field) searchParams.set('field', field);

  const resp = await fetchClient({
    url: apiBaseURL + '/search/autocomplete?' + searchParams.toString(),
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export const getTableFilterOptions = async <T>(
  category: string,
  key: string,
  search: string,
): Promise<string[]> => {
  const searchParams = new URLSearchParams(search);
  const keyword = searchParams.get('keyword') || '';
  const filters = searchParams.get('filters') || '';

  const filterMap = FilterMap.fromString(filters);

  const resp = await fetchClient({
    url: process.env.NEXT_PUBLIC_API_BASE_URL + '/search/table_filter_options',
    method: 'POST',
    body: JSON.stringify({
      q: keyword,
      category,
      filter_params: filterMap.toObject(),
      key,
    }),
  });

  const result = await resp.json();

  return result;
};

export async function getUserFromClient(apiBaseURL: string) {
  const resp = await fetchClient({
    url: apiBaseURL + '/user',
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export async function getChatSessions(): Promise<ChatSessionList> {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/sessions`,
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export async function getChatSession(id: string): Promise<ChatSession> {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/session?session_id=${id}`,
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export async function deleteChatSession(id: string) {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/session?session_id=${id}`,
    method: 'DELETE',
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }
}

export async function createChatSession() {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/session/create`,
    method: 'POST',
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export async function getDrugInfo(id: number) {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/drug/summary/${id}`,
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}

export async function getTargetInfo(id: number) {
  const resp = await fetchClient({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/target/summary/${id}`,
  });

  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
}
