import {
  ChatSession,
  Message,
  MessageContent,
  SendMessage,
} from '@/types/chat';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { createChatSession, getChatSession } from './api-client';
import { fetchSSE } from './fetch-sse';
import useForceUpdate from './use-force-update';
import { useRouter } from 'next/navigation';
import { useStore } from 'zustand';
import { useChatStore } from '@/store/chat-store';

const contentOrder = [
  'websearch',
  'pubmed',
  'sql',
  'table',
  'summary',
  'citation_summary',
  'related',
  'error',
];

export function getMessageContent(message: Message) {
  return message.content;
}

export default function useChat({
  session_id,
  onFinish,
  onError,
  onSettled,
}: {
  session_id: string | null;
  onFinish?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}) {
  const router = useRouter();

  const forceUpdate = useForceUpdate();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');

  const activeSessionIdRef = useRef(session_id);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const [isStreaming, setIsStreaming] = useState(false);
  const chatSessionId = useStore(useChatStore, (s) => s.chatSessionId);
  const setChatSessionId = useStore(useChatStore, (s) => s.setChatSessionId);

  const controllerRef = useRef<AbortController | null>(null);

  const { data: session, isPending } = useQuery({
    queryKey: ['chat-session', session_id],
    queryFn: async () => {
      if (!session_id || session_id === 'new') {
        return null;
      }
      return await getChatSession(session_id);
    },
    networkMode: 'offlineFirst',
    refetchOnWindowFocus: false,
    // enabled: !isStreaming,
    enabled:
      chatSessionId === null || chatSessionId === session_id
        ? !isStreaming
        : true,
    // enabled: session_id !== activeSessionIdRef.current,
  });

  const handleSubmit = useCallback(
    async (
      searchOptions: { web_search: boolean; db_search: string[] },
      message?: string, // if message is provided, use it instead of input
    ) => {
      setInput('');
      setIsStreaming(true);
      const messageText = message || input;

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        if (!session_id) {
          // create a new session
          const result: { session_id: string } = await createChatSession();
          activeSessionIdRef.current = result.session_id;
          queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
          router.push(`/chat?session=${result.session_id}`);
        } else {
          activeSessionIdRef.current = session_id;
        }

        let currentSession = queryClient.getQueryData<ChatSession>([
          'chat-session',
          activeSessionIdRef.current,
        ]);

        if (!currentSession) {
          currentSession = {
            session_id: activeSessionIdRef.current!,
            title: '新建对话',
            messages: [],
            created_at: new Date().toISOString(),
          };
          queryClient.setQueryData(
            ['chat-session', activeSessionIdRef.current],
            currentSession,
          );
        }

        const isFirstMessage =
          !currentSession || currentSession.messages.length === 0;
        const messageToSend: SendMessage = {
          message_id: uuid(),
          role: 'user',
          message_content: messageText,
          session_id: activeSessionIdRef.current!,
          // Only send search options for the first message
          features: isFirstMessage ? searchOptions : undefined,
        };
        console.log('sending message', messageToSend);
        const userMessage: Message = {
          id: messageToSend.message_id,
          session_id: session_id || 'new',
          role: 'user',
          content: [
            {
              type: 'question',
              data: messageText,
            },
          ],
        };
        const assistantMessageId = uuid();
        const assistantMessage: Message = {
          id: assistantMessageId,
          session_id: session_id || 'new',
          role: 'assistant',
          content: [],
          contentMap: new Map(),
        };

        queryClient.setQueryData<ChatSession>(
          ['chat-session', activeSessionIdRef.current],
          (old) => {
            console.log('setting data', old, currentSession);
            if (!old) {
              return produce(currentSession, (draft) => {
                draft.messages.push(userMessage);
                draft.messages.push(assistantMessage);
              });
            }
            return produce(old, (draft) => {
              draft.messages.push(userMessage);
              draft.messages.push(assistantMessage);
            });
          },
        );
        setChatSessionId(activeSessionIdRef.current!);
        await fetchSSE(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/conversation`,
          {
            method: 'POST',
            body: JSON.stringify(messageToSend),
            signal: controller.signal,
            onMessage: async (data) => {
              // Handle the message
              try {
                const parsedContent: {
                  session_id?: string;
                  id: string;
                  content?: MessageContent;
                } = JSON.parse(data);

                await queryClient.cancelQueries({
                  queryKey: ['chat-session', activeSessionIdRef.current],
                });

                const currentSession = queryClient.getQueryData<ChatSession>([
                  'chat-session',
                  activeSessionIdRef.current,
                ]);

                queryClient.setQueryData(
                  ['chat-session', activeSessionIdRef.current],
                  produce(currentSession, (draft) => {
                    if (!draft) {
                      return;
                    }
                    const lastAssistantMessage = draft.messages.at(-1);
                    if (!lastAssistantMessage || !parsedContent.content) {
                      return;
                    }

                    lastAssistantMessage.id = parsedContent.id;

                    if (!lastAssistantMessage.contentMap) {
                      return;
                    }

                    const currentType = parsedContent.content.type;

                    if (!lastAssistantMessage.contentMap.has(currentType)) {
                      lastAssistantMessage.contentMap.set(
                        currentType,
                        parsedContent.content,
                      );
                    } else {
                      if (
                        currentType === 'summary' ||
                        currentType === 'citation_summary'
                      ) {
                        lastAssistantMessage.contentMap.set(
                          currentType,
                          parsedContent.content,
                        );
                      } else {
                        const oldContent =
                          lastAssistantMessage.contentMap.get(currentType);
                        const newContent = {
                          type: currentType,
                          data: concatData(
                            oldContent?.data,
                            parsedContent.content.data,
                          ),
                        };
                        lastAssistantMessage.contentMap.set(
                          currentType,
                          newContent,
                        );
                      }
                    }

                    lastAssistantMessage.content = contentOrder
                      .filter((type) =>
                        lastAssistantMessage.contentMap?.has(type),
                      )
                      .map(
                        (type) => lastAssistantMessage.contentMap?.get(type)!,
                      );
                  }),
                );

                forceUpdate();
              } catch (error) {
                console.log('error handling message', error);
              }
            },
            onError: (error) => {
              console.log('error in fetchSSE', error);
            },
          },
        );
      } catch (error) {
        console.error('error in fetchSSE', error);
      } finally {
        setIsStreaming(false);
        activeSessionIdRef.current = null;
        setChatSessionId(null);
        onFinish?.();
        queryClient.invalidateQueries({
          queryKey: ['chat-sessions'],
        });
      }
    },
    [
      forceUpdate,
      input,
      onFinish,
      queryClient,
      router,
      session_id,
      setChatSessionId,
    ],
  );

  const regenerate = async () => {
    setIsStreaming(true);

    if (!session) {
      return;
    }
    activeSessionIdRef.current = session_id;

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // Optimistic update the current session
      // Cancel the query to fetch this chat session
      // Empty last assistant message because it will be replaced
      await queryClient.cancelQueries({
        queryKey: ['chat-session', session_id],
      });

      const currentSession = queryClient.getQueryData<ChatSession>([
        'chat-session',
        activeSessionIdRef.current,
      ]);

      if (!currentSession) {
        return;
      }

      if (currentSession.messages.length < 2) {
        throw new Error('No messages to regenerate');
      }

      await queryClient.setQueryData(
        ['chat-session', activeSessionIdRef.current],
        produce(currentSession, (draft) => {
          const lastAssistantMessage = draft.messages.at(-1);
          if (!lastAssistantMessage) {
            return;
          }
          if (lastAssistantMessage.role === 'assistant') {
            lastAssistantMessage.content = [];
            lastAssistantMessage.contentMap = new Map();
          }
        }),
      );

      const userMessage =
        currentSession.messages[currentSession.messages.length - 2];
      const lastAssistantMessage =
        currentSession.messages[currentSession.messages.length - 1];

      setChatSessionId(activeSessionIdRef.current!);
      await fetchSSE(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/regenerate`,
        {
          method: 'POST',
          body: JSON.stringify({
            session_id: session_id,
            message_id: lastAssistantMessage.id,
            question_message_id: userMessage.id,
          }),
          signal: controller.signal,
          onMessage: async (data) => {
            if (data === '[DONE]') {
              onFinish?.();
            }

            // Handle the message
            try {
              const parsedContent: {
                session_id?: string;
                id: string;
                content?: MessageContent;
              } = JSON.parse(data);

              if (!parsedContent.content) {
                return;
              }

              await queryClient.cancelQueries({
                queryKey: ['chat-session', session_id],
              });

              const currentSession = queryClient.getQueryData<ChatSession>([
                'chat-session',
                session_id,
              ]);

              queryClient.setQueryData(
                ['chat-session', session_id],
                produce(currentSession, (draft) => {
                  if (!draft) {
                    return;
                  }
                  const lastAssistantMessage = draft.messages.at(-1);
                  if (!lastAssistantMessage || !parsedContent.content) {
                    return;
                  }
                  if (!lastAssistantMessage.contentMap) {
                    return;
                  }

                  const currentType = parsedContent.content.type;

                  if (!lastAssistantMessage.contentMap.has(currentType)) {
                    lastAssistantMessage.contentMap.set(
                      currentType,
                      parsedContent.content,
                    );
                  } else {
                    if (
                      currentType === 'summary' ||
                      currentType === 'citation_summary'
                    ) {
                      lastAssistantMessage.contentMap.set(
                        currentType,
                        parsedContent.content,
                      );
                    } else {
                      const oldContent =
                        lastAssistantMessage.contentMap.get(currentType);
                      const newContent = {
                        type: currentType,
                        data: concatData(
                          oldContent?.data,
                          parsedContent.content.data,
                        ),
                      };
                      lastAssistantMessage.contentMap.set(
                        currentType,
                        newContent,
                      );
                    }
                  }

                  lastAssistantMessage.content = contentOrder
                    .filter((type) =>
                      lastAssistantMessage.contentMap?.has(type),
                    )
                    .map((type) => lastAssistantMessage.contentMap?.get(type)!);
                }),
              );
              forceUpdate();
            } catch (error) {
              console.log('error handling message', error);
            }
          },
          onError: (error) => {
            onError?.(error);
          },
        },
      );
    } catch (error) {
      console.error('error in fetchSSE', error);
    } finally {
      setIsStreaming(false);
      activeSessionIdRef.current = null;
      setChatSessionId(null);
      queryClient.invalidateQueries({
        queryKey: ['chat-session', session_id],
      });
    }
  };

  const submitQuestion = useCallback(
    (
      message: string,
      options: {
        web_search: boolean;
        db_search: string[];
      },
    ) => {
      if (isStreaming || !message || message.trim().length < 2) {
        return;
      }

      handleSubmit(options, message);
    },
    [handleSubmit, isStreaming],
  );

  const stopGeneration = useCallback(async () => {
    if (controllerRef.current) {
      console.log('stop generation');
      controllerRef.current.abort();
    }
  }, []);

  return {
    session,
    isSessionLoading: isPending,
    isStreaming,
    input,
    handleInputChange,
    handleSubmit,
    submitQuestion,
    regenerate,
    stopGeneration,
  };
}

const concatData = (a: unknown, b: unknown) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  }
  return b;
};
