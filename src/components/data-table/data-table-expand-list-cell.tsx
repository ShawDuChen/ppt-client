import { Getter } from '@tanstack/react-table';

interface DataTableExpandableListCellProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  getValue: Getter<TValue>;
  renderListItem: (item: any, index: number) => React.ReactNode;
  defaultRows?: number;
  rowExpanded?: boolean;
  toggle?: () => void;
  suffix?: string;
  textWrap?: boolean;
}

export function DataTableExpandableListCell<TData, TValue>({
  getValue,
  defaultRows = 5,
  renderListItem,
  rowExpanded,
  toggle,
  suffix,
  textWrap = false,
  className,
}: DataTableExpandableListCellProps<TData, TValue>) {
  const value = getValue();

  if (Array.isArray(value)) {
    let _value = [] as TValue[];
    if (rowExpanded) {
      _value = value;
    } else {
      _value = value.slice(0, defaultRows);
    }

    return (
      <div className={className}>
        <ul>
          {_value.map((item, index) => (
            <li key={index} className={textWrap ? '' : 'whitespace-nowrap'}>
              {renderListItem(item, index)}
              {index < value.length - 1 && suffix}
            </li>
          ))}
        </ul>
        {value.length > defaultRows && (
          <div>
            <button
              className="inline-block rounded-sm bg-blue-50 px-2 py-0.5 text-sm text-primary transition-colors hover:bg-primary/20"
              onClick={() => toggle && toggle()}
            >
              {rowExpanded ? '收起' : `+ ${value.length - defaultRows}`}
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
