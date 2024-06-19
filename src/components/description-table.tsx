import React, { FC } from 'react';

interface DescriptionTableItem {
  key: string;
  label: string;
  value: React.ReactNode;
  colSpan?: number;
}

interface DescriptionTableProps {
  items: DescriptionTableItem[];
  columns?: number;
}

const arrangeItems = (items: DescriptionTableItem[], columns: number) => {
  // arrange items into rows according to their colSpan
  const rows: DescriptionTableItem[][] = [];
  let currentRow: DescriptionTableItem[] = [];
  let currentCol = 0;
  for (const item of items) {
    if (currentCol + (item.colSpan || 1) > columns) {
      rows.push(currentRow);
      currentRow = [];
      currentCol = 0;
    }
    currentRow.push(item);
    currentCol += item.colSpan || 1;
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  return rows;
};

const DescriptionTable: FC<DescriptionTableProps> = ({
  items,
  columns = 1,
}) => {
  const tableRows = arrangeItems(items, columns);

  return (
    <table className="w-full">
      <tbody>
        {tableRows.map((row, index) => (
          <tr key={index}>
            {row.map((item) => (
              <td key={item.key} colSpan={item.colSpan} className="pb-4">
                <div className="flex flex-col sm:flex-row">
                  <span className="min-w-[200px] font-semibold">
                    {item.label}
                  </span>
                  <span className="text-sub-text">{item.value}</span>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DescriptionTable;
