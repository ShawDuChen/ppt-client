/**
 * Input Element for Two Numbers
 */

import { Input } from './ui/input';

export interface NumberRangeInputProps {
  min?: number;
  max?: number;
  value?: number[];
  onChange?: (value: number[] | undefined) => void;
}

const NumberRangeInput = ({
  value,
  onChange,
  min,
  max,
}: NumberRangeInputProps) => {
  return (
    <div className="flex items-center">
      <Input
        type="number"
        min={min}
        max={max}
        value={Number.isNaN(value?.[0]) ? '' : value?.[0].toString()}
        onChange={(e) => {
          const newValue = [Number(e.target.value), value?.[1] || 0];
          onChange?.(newValue);
        }}
      />
      <span className="mx-2">-</span>
      <Input
        type="number"
        min={min}
        max={max}
        value={Number.isNaN(value?.[1]) ? '' : value?.[1].toString()}
        onChange={(e) => {
          const newValue = [value?.[0] || 0, Number(e.target.value)];
          onChange?.(newValue);
        }}
      />
    </div>
  );
};

export { NumberRangeInput };
