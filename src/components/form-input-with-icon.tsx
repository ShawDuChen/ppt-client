'use client';

import { cn } from '@/lib/utils';
import { useFormField } from './ui/form';
import React from 'react';
import { InputProps } from './ui/input';

export interface FormInputWithIconProps extends InputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInputWithIcon = React.forwardRef<
  HTMLInputElement,
  FormInputWithIconProps
>(({ className, type, leftIcon, rightIcon, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <div className="relative flex flex-1">
      {leftIcon && (
        <span
          className={cn(
            'absolute left-0 flex h-full items-center border-r px-3',
            {
              'border-red-500': error,
            },
          )}
        >
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'pl-12': leftIcon,
            'pr-12': rightIcon,
          },
          {
            'border-red-500': error,
          },
          className,
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <span
          className={cn(
            'absolute right-0 flex h-full items-center border-l px-3',
            {
              'border-red-500': error,
            },
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
});

FormInputWithIcon.displayName = 'Input';

export { FormInputWithIcon };
