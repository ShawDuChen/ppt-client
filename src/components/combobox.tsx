import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { forwardRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

export interface ComboboxOption {
  value: string;
  label: React.ReactNode;
}

type ComboboxPropsSingle = {
  options: ComboboxOption[];
  emptyText?: string;
  clearable?: boolean;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
  allowSelectAll?: false;
};

type ComboboxPropsMultiple = {
  options: ComboboxOption[];
  emptyText?: string;
  clearable?: boolean;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  allowSelectAll?: boolean;
};

export type ComboboxProps = ComboboxPropsSingle | ComboboxPropsMultiple;

export const handleSingleSelect = (
  props: ComboboxPropsSingle,
  option: ComboboxOption,
) => {
  if (props.clearable) {
    props.onValueChange?.(option.value === props.value ? '' : option.value);
  } else {
    props.onValueChange?.(option.value);
  }
};

export const handleMultipleSelect = (
  props: ComboboxPropsMultiple,
  option: ComboboxOption,
) => {
  if (option.value === '全部') {
    props.onValueChange?.(['全部']);
    return;
  }

  if (props.value?.includes(option.value)) {
    if (!props.clearable && props.value.length === 1) return false;
    props.onValueChange?.(
      props.value.filter((value) => value !== option.value),
    );
  } else {
    const allSelected = [...(props.value ?? []), option.value];
    const allSelectedInOrder = props.options.filter((option) =>
      allSelected.includes(option.value),
    );

    props.onValueChange?.(allSelectedInOrder.map((option) => option.value));
  }
};

export const Combobox = forwardRef(
  (props: ComboboxProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const [open, setOpen] = useState(false);

    const options = props?.allowSelectAll
      ? [{ value: '全部', label: '全部' }, ...props.options]
      : props.options;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant="outline"
            aria-expanded={open}
            className="w-full justify-between hover:bg-secondary/20 active:scale-100"
          >
            <span className="line-clamp-1 text-left font-normal">
              {props.multiple && props.value && props.value.length === 1 && (
                <span className="mr-2">{props.value}</span>
              )}

              {props.multiple && props.value && props.value.length > 1 && (
                <span className="mr-2">已选中{props.value.length}项</span>
              )}

              {!props.multiple &&
                props.value &&
                props.value !== '' &&
                props.options.find((option) => option.value === props.value)
                  ?.label}

              {!props.value ||
                (props.value.length === 0 &&
                  (props.selectPlaceholder ?? 'Select an option'))}
            </span>
            <ChevronDownIcon
              className={cn(
                'ml-2 h-4 w-4 shrink-0 rotate-0 opacity-50 transition-transform',
                open && 'rotate-180',
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              ref={ref}
              placeholder={props.searchPlaceholder ?? 'Search for an option'}
            />
            <CommandEmpty>{props.emptyText ?? 'No results found'}</CommandEmpty>
            <CommandGroup>
              <ScrollArea>
                <div className="max-h-60">
                  {options.map((option) => (
                    <CommandItem
                      className="cursor-pointer"
                      key={option.value}
                      value={option.value.toLowerCase().trim() + option.label}
                      onSelect={(selectedValue) => {
                        const option = options.find(
                          (option) =>
                            option.value.toLowerCase().trim() + option.label ===
                            selectedValue,
                        );

                        if (!option) return null;

                        if (props.multiple) {
                          handleMultipleSelect(props, option);
                        } else {
                          handleSingleSelect(props, option);

                          setOpen(false);
                        }
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4 opacity-0',
                          !props.multiple &&
                            props.value === option.value &&
                            'opacity-100',
                          props.multiple &&
                            props.value?.includes(option.value) &&
                            'opacity-100',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = 'Combobox';
