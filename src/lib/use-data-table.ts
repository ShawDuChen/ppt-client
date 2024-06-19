'use client';

// https://github.com/sadmann7/shadcn-table

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { z } from 'zod';
import { RowExpandedFeature } from './feature-row-expanded';

interface UseDataTableProps<TData, TValue> {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[];

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number;

  /**
   * The default number of rows per page.
   * @default 10
   * @type number | undefined
   * @example 20
   */
  defaultPerPage?: number;

  /**
   * The default sort order.
   * @default undefined
   * @type `${Extract<keyof TData, string | number>}.${"asc" | "desc"}` | undefined
   * @example "createdAt.desc"
   */
  defaultSort?: `${Extract<keyof TData, string | number>}.${'asc' | 'desc'}`;
}

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  defaultPerPage = 10,
  defaultSort,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const perPage = search.pageSize ?? defaultPerPage;
  const sort = search.sort ?? defaultSort;
  const [column, order] = sort?.split('.') ?? [undefined, undefined];

  // Memoize computation filterableColumns
  // NOTE: Here I used column.id to get filterableColumns,
  // so be sure to assign columns ids manually in column definitions
  // Maybe we can figure out a better way that doesn't need to manually assign ids in column def
  const { filterableColumns } = React.useMemo(() => {
    return {
      filterableColumns: columns
        .filter((column) => {
          return !!column.meta?.getFilterOptions;
        })
        .map((column) => {
          return {
            value: column.id as string,
          };
        }),
    };
  }, [columns]);

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const filterableColumn = filterableColumns.find(
          (column) => column.value === key,
        );

        if (filterableColumn) {
          filters.push({
            id: key,
            value: value.split('.'),
          });
        }
        return filters;
      },
      [],
    );
  }, [filterableColumns, searchParams]);

  // Table states
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);
  const [rowExpanded, setRowExpanded] = React.useState(data.map(() => false));

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: perPage,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  React.useEffect(() => {
    setPagination({
      pageIndex: page - 1,
      pageSize: perPage,
    });
  }, [page, perPage]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        pageSize: pageSize,
      })}`,
      {
        scroll: false,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  React.useEffect(() => {
    setRowExpanded(data.map(() => false));
  }, [data]);

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>(
    column && order
      ? [
          {
            id: column,
            desc: order === 'desc',
          },
        ]
      : [],
  );

  React.useEffect(() => {
    const sort = sorting
      .map(({ id, desc }) => `${id}.${desc ? 'desc' : 'asc'}`)
      .join(',');

    router.push(
      `${pathname}?${createQueryString({
        page,
        // TODO: fix multiple sorting
        sort: sort || null,
      })}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  // Handle server-side filtering
  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id);
  });

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Prevent resetting the page on initial render
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Initialize new params
    const newParamsObject = {
      page: 1,
    };

    // Handle filterable column filters
    for (const column of filterableColumnFilters) {
      if (typeof column.value === 'object' && Array.isArray(column.value)) {
        if (column.value.length === 0) {
          Object.assign(newParamsObject, { [column.id]: null });
          continue;
        }
        Object.assign(newParamsObject, { [column.id]: column.value.join('.') });
      }
    }

    // Remove deleted values
    for (const key of searchParams.keys()) {
      if (
        filterableColumns.find((column) => column.value === key) &&
        !filterableColumnFilters.find((column) => column.id === key)
      ) {
        Object.assign(newParamsObject, { [key]: null });
      }
    }

    // After cumulating all the changes, push new params
    router.push(`${pathname}?${createQueryString(newParamsObject)}`);

    table.setPageIndex(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filterableColumnFilters),
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    _features: [RowExpandedFeature],
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      rowExpanded,
    },
    enableMultiSort: true,
    isMultiSortEvent: (e) => true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onRowExpandedChange: setRowExpanded,
  });

  return { table };
}
