import { use } from 'react';
import { type Column } from '@tanstack/react-table';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Spinner from '../spinner';
import { ScrollArea, ScrollAreaViewport } from '../ui/scroll-area';

const MAX_DISPLAYED_OPTIONS = 20;

interface AsyncFilterOptionListProps<TData, TValue> {
  column: Column<TData, TValue>;

  getOptions: (
    category: string,
    key: string,
    search: string,
  ) => Promise<{ label: string; value: string }[]>;
}

export const AsyncFilterOptionList = <TData, TValue>({
  column,
  getOptions,
}: AsyncFilterOptionListProps<TData, TValue>) => {
  const searchParams = useSearchParams();

  const { data: options, isLoading } = useQuery({
    queryKey: ['filterOptions', column.id],
    queryFn: () => getOptions('drug', column.id, searchParams.toString()),
  });

  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const displayedOptions = options?.slice(0, MAX_DISPLAYED_OPTIONS);

  return (
    <>
      {isLoading && (
        <div className="flex h-24 items-center justify-center">
          <Spinner className="h-5 w-5" />
        </div>
      )}
      {options?.length === 0 && (
        <DropdownMenuItem className="text-center">无</DropdownMenuItem>
      )}
      <ScrollArea>
        <ScrollAreaViewport className="max-h-80 w-48">
          {displayedOptions?.map((option) => {
            const isSelected = selectedValues.has(option.value);
            return (
              <DropdownMenuItem
                className="cursor-pointer"
                key={option.value}
                aria-label={option.label}
                onClick={() => {
                  if (selectedValues.has(option.value)) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }

                  const filterValues = Array.from(selectedValues);

                  column.setFilterValue(
                    filterValues.length ? filterValues : undefined,
                  );
                }}
              >
                <div
                  className={cn(
                    'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible',
                  )}
                >
                  <CheckIcon className="size-4" aria-hidden="true" />
                </div>
                {option.label}
              </DropdownMenuItem>
            );
          })}
          {/* 后端：如果结果数量大于20，会返回21条数据
              前端：What the ????
           */}
          {options?.length && options.length > MAX_DISPLAYED_OPTIONS && (
            <DropdownMenuItem disabled>
              <div className="w-full text-center">
                {`仅显示前 ${displayedOptions?.length} 个`}
              </div>
            </DropdownMenuItem>
          )}
        </ScrollAreaViewport>
      </ScrollArea>
    </>
  );
};
