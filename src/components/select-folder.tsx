'use client';

import fetchClient from '@/lib/fetch-client';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, FolderClosedIcon } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import Spinner from './spinner';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

const listDir = async (
  id: number,
): Promise<{
  id: number;
  name: string;
  is_shared: boolean;
  deletable: boolean;
  pinned: boolean;
  files: {
    id: number;
    name: string;
    note: string;
    is_dir: boolean;
    url: string | null;
    is_shared: boolean;
    deletable: boolean;
    pinned: boolean;
  }[];
}> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/workspace/list?${new URLSearchParams(
    {
      id: id.toString(),
    },
  )}`;

  const resp = await fetchClient({ url });

  return await resp.json();
};

interface SelectFolderProps {
  value: number;
  onChange: (id: number) => void;
}

const SelectFolder = forwardRef<React.ElementRef<'div'>, SelectFolderProps>(
  ({ value, onChange }, ref) => {
    // value is not used here
    // because we can't preserve the dir segments when form modal is closed and reopened
    // so we always use the initial value 0

    const [currentDirId, setCurrentDirId] = useState(0);
    const [dirSegments, setDirSegments] = useState<
      { id: number; name: string }[]
    >([{ id: 0, name: '全部收藏' }]);

    const { data: folderData, isLoading } = useQuery({
      queryKey: ['listDir', currentDirId],
      queryFn: () => listDir(currentDirId),
    });

    useEffect(() => {
      onChange?.(currentDirId);
    }, [currentDirId, onChange]);

    const onEnterDir = (file: { id: number; name: string }) => {
      setCurrentDirId(file.id);
      setDirSegments((prev) => [...prev, { id: file.id, name: file.name }]);
    };

    const files = folderData?.files.filter(
      (f: any) => f.is_dir && !f.is_shared,
    );

    return (
      <ScrollArea className="h-60 rounded-md border px-3 py-2">
        <div ref={ref}>
          <div className="sticky top-0 mb-2 bg-white">
            {dirSegments.map((segment, index) => (
              <span
                key={segment.id}
                className={cn(
                  'cursor-pointer text-sm text-gray-500 hover:text-primary',
                  index !== dirSegments.length - 1 && 'mr-1',
                )}
                onClick={() => {
                  setCurrentDirId(segment.id);
                  onChange?.(segment.id);
                  setDirSegments((prev) => prev.slice(0, index + 1));
                }}
              >
                {segment.name}
                {index !== dirSegments.length - 1 && (
                  <ChevronRightIcon className="inline-block h-3 w-3" />
                )}
              </span>
            ))}
          </div>
          {isLoading ? (
            <div className="flex h-44 items-center justify-center">
              <Spinner className="mx-auto h-4 w-4" />
            </div>
          ) : (
            <div className="space-y-1">
              {files?.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-gray-100',
                  )}
                  onDoubleClick={() => {
                    onEnterDir(file);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <FolderClosedIcon className="h-5 w-5 text-gray-700" />
                    <span className="text-gray-700 hover:text-primary">
                      {file.name}
                    </span>
                  </div>
                  <button
                    className="rounded-full p-1 hover:bg-gray-200 hover:text-primary"
                    onClick={() => {
                      onEnterDir(file);
                    }}
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {files?.length === 0 && (
            <div className="flex h-40 items-center justify-center">
              <span className="text-gray-500">
                选择 {dirSegments[dirSegments.length - 1].name} 文件夹
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  },
);

SelectFolder.displayName = 'SelectFolder';

export default SelectFolder;
