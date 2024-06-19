import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { format } from 'date-fns';
import { CalendarIcon, XCircleIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { zhCN } from 'date-fns/locale';
import { Matcher } from 'react-day-picker';

export interface DatePickerProps {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
  disabledSelected?: Matcher;
  // TODO: Add a clear button
  onClear?: () => void;
}

const DatePicker = ({
  value,
  onChange,
  placeholder,
  disabledSelected,
  onClear,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="group relative w-full flex-1">
          <Button
            type="button"
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            {value ? (
              format(value, 'PP', { locale: zhCN })
            ) : (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {placeholder || '选择日期'}
              </span>
            )}
            {!value ? (
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            ) : (
              <XCircleIcon
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange?.(undefined);
                  onClear?.();
                }}
              />
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (!date) onChange?.(undefined);
            onChange?.(date);
          }}
          initialFocus
          numberOfMonths={1}
          disabled={disabledSelected}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
