import { Table } from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import Pagination from 'rc-pagination';

import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 50],
}: DataTablePaginationProps<TData>) {
  return (
    <>
      <Pagination
        className="flex items-center justify-center gap-2 px-2 py-4"
        current={table.getState().pagination.pageIndex + 1}
        pageSize={table.getState().pagination.pageSize}
        total={table.getPageCount() * table.getState().pagination.pageSize}
        pageSizeOptions={pageSizeOptions}
        onChange={(page, pageSize) => {
          table.setPageSize(pageSize);
          table.setPageIndex(page - 1);
        }}
        itemRender={(current, type, element) => {
          if (type === 'page') {
            return (
              <Button
                className="h-9 w-9"
                size="icon"
                variant={
                  table.getState().pagination.pageIndex + 1 === current
                    ? 'default'
                    : 'outline'
                }
              >
                {current}
              </Button>
            );
          }
          if (type === 'prev') {
            return (
              <Button size="icon" className="h-9 w-9" variant="outline">
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            );
          }
          if (type === 'jump-prev') {
            return (
              <Button size="icon" className="h-9 w-9" variant="outline">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            );
          }
          if (type === 'jump-next') {
            return (
              <Button size="icon" variant="outline" className="h-9 w-9">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            );
          }
          if (type === 'next') {
            return (
              <Button size="icon" className="h-9 w-9" variant="outline">
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            );
          }
          return element;
        }}
      />
      {/* <div className="flex items-center justify-center px-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div> */}
    </>
  );
}
