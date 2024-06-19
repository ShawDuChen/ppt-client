import { type Column } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  FilterIcon,
  XCircleIcon,
} from 'lucide-react';
import { Suspense } from 'react';
import Spinner from '../spinner';
import { AsyncFilterOptionList } from './async-options';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <div className={cn('flex items-center', className)}>
      <span>{title}</span>
      {column.getCanSort() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={
                column.getIsSorted() === 'desc'
                  ? 'Sorted descending. Click to sort ascending.'
                  : column.getIsSorted() === 'asc'
                    ? 'Sorted ascending. Click to sort descending.'
                    : 'Not sorted. Click to sort ascending.'
              }
              variant="ghost"
              size="icon"
              className="h-6 w-6 data-[state=open]:bg-accent"
            >
              {column.getCanSort() && column.getIsSorted() === 'desc' ? (
                <ArrowDownIcon className="size-4" aria-hidden="true" />
              ) : column.getIsSorted() === 'asc' ? (
                <ArrowUpIcon className="size-4" aria-hidden="true" />
              ) : (
                <ArrowUpDownIcon className="size-4" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {column.getCanSort() && (
              <>
                <DropdownMenuItem
                  aria-label="Sort ascending"
                  onClick={() => column.toggleSorting(false, true)}
                >
                  <ArrowUpIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Asc
                </DropdownMenuItem>
                <DropdownMenuItem
                  aria-label="Sort descending"
                  onClick={() => column.toggleSorting(true, true)}
                >
                  <ArrowDownIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Desc
                </DropdownMenuItem>
                <DropdownMenuItem
                  aria-label="Clear sorting"
                  onClick={() => column.clearSorting()}
                >
                  <XCircleIcon
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Clear
                </DropdownMenuItem>
              </>
            )}
            {/* {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )} */}
            {/* {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Hide column"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOffIcon
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Hide
            </DropdownMenuItem>
          )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {column.getCanFilter() && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Filter"
              variant="ghost"
              size="icon"
              className="h-6 w-6 data-[state=open]:bg-accent"
            >
              <FilterIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {column.columnDef.meta?.getFilterOptions && (
              <Suspense
                fallback={
                  <div>
                    <div className="flex h-36 items-center justify-center">
                      <Spinner />
                    </div>
                  </div>
                }
              >
                <AsyncFilterOptionList
                  column={column}
                  getOptions={column.columnDef.meta.getFilterOptions}
                />
              </Suspense>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
