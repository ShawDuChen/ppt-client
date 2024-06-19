import { cn } from '@/lib/utils';

export default function Empty({
  content,
  className,
}: {
  content?: React.ReactNode;
  className?: string;
}) {
  const _content = content || 'No data available';

  return (
    <div className={cn('h-32 w-full', className)}>
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        {_content}
      </div>
    </div>
  );
}
