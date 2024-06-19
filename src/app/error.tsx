'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <div className="container flow-root h-[calc(100vh-64px)]">
        {/* Display some error info */}
        <div className="mx-auto my-10 w-[600px]">
          <div className="mt-40">
            <h3 className="mb-10 text-2xl font-semibold leading-none tracking-tight">
              哎呀，出错了
            </h3>

            <p>
              遇到一些问题，您可以尝试
              <Button
                variant="link"
                className="px-1 text-base"
                onClick={() => {
                  // hard refresh the page
                  // const url = new URL(window.location.href);
                  // router.push(url.origin + url.pathname);
                  router.refresh();
                  startTransition(() => reset());
                }}
              >
                重试
              </Button>
              ，或者
              <Button
                variant="link"
                className="px-1 text-base"
                onClick={() => {
                  router.replace('/');
                }}
              >
                返回首页
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
