// fetch-sse
// credit: @transitive-bullshit
// https://github.com/transitive-bullshit/chatgpt-api/blob/main/src/fetch-sse.ts

import { createParser } from 'eventsource-parser';
import { streamAsyncIterable } from './stream-async-iterable';
import { getSession } from 'next-auth/react';
import { getCurrentUserToken } from './token-storage';

type Fetch = typeof fetch;

export async function fetchSSE(
  url: string,
  options: Parameters<typeof fetch>[1] & {
    onMessage: (data: string) => void;
    onError?: (error: any) => void;
  },
  fetch: Fetch = globalThis.fetch,
) {
  const accessToken = getCurrentUserToken();

  const { onMessage, onError, ...fetchOptions } = options;

  // add authorization header
  fetchOptions.headers = {
    ...fetchOptions.headers,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    let reason: string;

    try {
      reason = await res.text();
    } catch (err) {
      reason = res.statusText;
    }

    const msg = `fetch sse error ${res.status}: ${reason}`;
    const error = new Error(msg);
    // error.statusCode = res.status;
    // error.statusText = res.statusText;
    throw error;
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data);
    }
  });

  // handle special response errors
  const feed = (chunk: string) => {
    let response = null;

    try {
      response = JSON.parse(chunk);
    } catch {
      // ignore
    }

    if (response?.detail?.type === 'invalid_request_error') {
      const msg = `fetch sse error ${response.detail.message}: ${response.detail.code} (${response.detail.type})`;
      const error = new Error(msg);
      // error.statusCode = response.detail.code;
      // error.statusText = response.detail.message;

      if (onError) {
        onError(error);
      } else {
        console.error(error);
      }

      // don't feed to the event parser
      return;
    }

    parser.feed(chunk);
  };

  if (!res.body?.getReader) {
    // Vercel polyfills `fetch` with `node-fetch`, which doesn't conform to
    // web standards, so this is a workaround...
    const body: NodeJS.ReadableStream = res.body as any;

    if (!body.on || !body.read) {
      throw new Error('unsupported "fetch" implementation');
    }

    body.on('readable', () => {
      let chunk: string | Buffer;
      while (null !== (chunk = body.read())) {
        feed(chunk.toString());
      }
    });
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk);
      feed(str);
    }
  }
}
