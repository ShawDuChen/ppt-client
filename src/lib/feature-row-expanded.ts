import {
  RowData,
  TableFeature,
  Table,
  OnChangeFn,
  makeStateUpdater,
  Updater,
  functionalUpdate,
  Row,
} from '@tanstack/react-table';

export type RowExpandedState = boolean[];

interface RowExpandedTableState {
  rowExpanded: RowExpandedState;
}

interface RowExpandedOptions {
  onRowExpandedChange?: OnChangeFn<RowExpandedState>;
}

export interface TableRowExpandedInstance {
  setRowExpanded: (updater: Updater<RowExpandedState>) => void;
  toggleRowExpanded: (value: number) => void;
  getRowExpanded: (value: number) => boolean;
}

export interface RowExpandedInstance {
  toggleRowExpanded: () => void;
  getIsRowExpanded: () => boolean;
}

declare module '@tanstack/react-table' {
  interface TableState extends RowExpandedTableState {}
  interface TableOptionsResolved<TData extends RowData>
    extends RowExpandedOptions {}
  interface Table<TData extends RowData> extends TableRowExpandedInstance {}
  interface Row<TData extends RowData> extends RowExpandedInstance {}
}

export const RowExpandedFeature: TableFeature<any> = {
  getInitialState: (state: any): RowExpandedTableState => {
    return {
      rowExpanded: [],
      ...state,
    };
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>,
  ): RowExpandedOptions => {
    return {
      onRowExpandedChange: makeStateUpdater('rowExpanded', table),
    } as RowExpandedOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowExpanded = (updater) => {
      const safeUpdater: Updater<RowExpandedState> = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onRowExpandedChange?.(safeUpdater);
    };
    table.toggleRowExpanded = (value: number) => {
      table.setRowExpanded((old) => {
        return [...old.slice(0, value), !old[value], ...old.slice(value + 1)];
      });
    };
    table.getRowExpanded = (value: number) => {
      return table.getState().rowExpanded[value];
    };
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>,
  ): void => {
    row.toggleRowExpanded = () => {
      table.toggleRowExpanded(row.index);
    };
    row.getIsRowExpanded = () => {
      return table.getRowExpanded(row.index);
    };
  },
};
