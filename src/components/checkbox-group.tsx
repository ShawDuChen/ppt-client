'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface CheckboxGroupProps {
  groupName: string;
  selectAll?: boolean;
  className?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
  options: {
    label: string;
    value: string;
  }[];
}

const CheckboxGroup = React.forwardRef<
  React.ElementRef<'div'>,
  CheckboxGroupProps
>(
  (
    {
      groupName,
      selectAll = false,
      className,
      value,
      onValueChange,
      defaultValue,
      options,
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)}>
        {selectAll && (
          <div>
            <Checkbox
              id={groupName + 'all'}
              className="peer hidden"
              checked={
                value?.includes('全部') ||
                defaultValue?.includes('全部') ||
                false
              }
              onCheckedChange={(checked) => {
                onValueChange?.(['全部']);
              }}
            />
            <Label
              htmlFor={groupName + 'all'}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-normal hover:bg-muted peer-data-[state='checked']:bg-primary peer-data-[state='checked']:text-primary-foreground"
            >
              全部
            </Label>
          </div>
        )}
        {options.map((option) => {
          const checked =
            value?.includes(option.value) ||
            defaultValue?.includes(option.value);
          return (
            <div key={option.value}>
              <Checkbox
                id={groupName + option.value}
                className="peer hidden"
                checked={checked}
                onCheckedChange={(checked) => {
                  if (onValueChange) {
                    if (checked) {
                      onValueChange(
                        [...(value || []), option.value].filter(
                          (v) => v !== '全部',
                        ),
                      );
                    } else {
                      if (value?.length === 1) {
                        onValueChange(['全部']);
                        return;
                      }
                      onValueChange(
                        value?.filter((v) => v !== option.value) || [],
                      );
                    }
                  }
                }}
              />
              <Label
                htmlFor={groupName + option.value}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-normal hover:bg-muted peer-data-[state='checked']:bg-primary peer-data-[state='checked']:text-primary-foreground"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup };
