'use client';

import { getTableResult } from '@/lib/api-server';
import { useDataTable } from '@/lib/use-data-table';
import { useColumnsStore } from '@/store/store';
import { SearchCategory } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { StarIcon, XIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC, use, useEffect, useRef } from 'react';
import { z } from 'zod';
import CustomColumnsButton, {
  GroupColumnKey,
} from '../app/search/(category)/custom-columns-button';
import { DataTable } from './data-table/data-table';
import FavButton from './fav-button';
import { Button } from './ui/button';
import ExportButton from '@/app/search/(category)/export-button';
import Spinner from './spinner';

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().optional(),
  sort: z.string().optional(),
});

interface SearchResultViewProps {
  dataPromise: ReturnType<typeof getTableResult>;
  columns: ColumnDef<unknown, any>[];
  category: SearchCategory;
  layout?: 'graph' | 'table';
  groupEnabled?: boolean;
  groupColumnKeys?: GroupColumnKey[];
}

const SearchResultView: FC<SearchResultViewProps> = ({
  dataPromise,
  columns,
  category,
  layout = 'table',
  groupEnabled = false,
  groupColumnKeys,
}) => {
  const result = use(dataPromise);
  const searchParams = useSearchParams();
  const { page, pageSize } = schema.parse(Object.fromEntries(searchParams));

  const _pageSize = pageSize ?? 10;

  const { table } = useDataTable({
    columns,
    data: result.data,
    defaultPerPage: 10,
    pageCount: Math.ceil(result.total / _pageSize),
  });

  const selectedColumnKeys = useColumnsStore((state) => state.selectedKeys);

  useEffect(() => {
    const tableColumns = table.getAllColumns();
    if (selectedColumnKeys[category].length) {
      table.setColumnVisibility(
        Object.fromEntries(
          tableColumns.map((column) => [
            column.id,
            selectedColumnKeys[category].includes(column.id as any),
          ]),
        ),
      );
    }
  }, [category, selectedColumnKeys, table]);

  const storeIsReady = useRef(false);

  useEffect(() => {
    storeIsReady.current = true;
    return () => {
      storeIsReady.current = false;
    };
  }, [selectedColumnKeys]);

  return result.status === 403 ? (
    <div className="flex h-[500px] flex-col items-center justify-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        您没有访问权限
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        请联系管理员升级您的账号
      </p>
    </div>
  ) : (
    <div>
      {/* header */}
      <div className="md:flex md:items-end md:justify-between">
        <div className="text-sm">
          <p className="text-lg font-semibold text-gray-500">
            共 {result.total} 条
            {/* ，筛选条件：
            {keyword} */}
          </p>
        </div>
        <div className="mt-8 flex justify-end gap-4 text-secondary-foreground/60 md:mt-0">
          <FavButton
            apiBaseUrl={process.env.NEXT_PUBLIC_API_BASE_URL || ''}
            trigger={
              <Button variant="secondary" className="text-primary/50">
                <StarIcon size={16} className="mr-2" />
                收藏
              </Button>
            }
          />
          <CustomColumnsButton
            category={category}
            groupEnabled={groupEnabled}
            groupColumnKeys={groupColumnKeys}
          />
          <ExportButton category={category} search={searchParams} />

          {/* <SearchResultLayoutSwitcher /> */}
        </div>
      </div>

      <div className="mt-6">
        {layout === 'graph' && <div>graph</div>}

        {layout === 'table' && (
          <div>
            <div className="mb-2 space-x-2">
              {table.getState().sorting.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    table.resetSorting();
                  }}
                >
                  清除排序
                  <XIcon size={16} className="ml-2" />
                </Button>
              )}
              {table.getState().columnFilters.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    table.resetColumnFilters();
                  }}
                >
                  清除筛选
                  <XIcon size={16} className="ml-2" />
                </Button>
              )}
            </div>
            {storeIsReady.current ? (
              <DataTable table={table} />
            ) : (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultView;
