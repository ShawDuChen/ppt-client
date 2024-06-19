import { DatePicker } from './ui/date-picker';

export interface DateRangePickerProps {
  value?: (Date | undefined)[];
  onChange?: (value: (Date | undefined)[] | undefined) => void;
}

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const resetValue = () => {
    if (value && value.length) {
      const [start, end] = value;
      (!start || !end) && onChange?.(undefined);
    }
  };
  return (
    <div className="flex w-full flex-wrap gap-2">
      <DatePicker
        value={value && value[0]}
        placeholder="开始日期"
        onChange={(val) => onChange && onChange([val, value && value[1]])}
        disabledSelected={(date) => (date && value ? date > value[1]! : false)}
        onClear={resetValue}
      />
      <DatePicker
        value={value && value[1]}
        placeholder="结束日期"
        onChange={(val) => onChange && onChange([value && value[0], val])}
        disabledSelected={(date) => (date && value ? date < value[0]! : false)}
        onClear={resetValue}
      />
    </div>
  );
};

export { DateRangePicker };
