'use client';

import useIsTabActive from '@/lib/use-is-active';
import { getSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export const RefetchSession = () => {
  const isActive = useIsTabActive();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function refetchSession() {
      await getSession();
    }

    if (isActive) {
      intervalRef.current = setInterval(
        () => {
          refetchSession();
        },
        1000 * 60 * 10, // 10 minutes
      );
    } else {
      // stop refetching
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  return null;
};
