'use client';

import { fetchCompletions } from '@/lib/api-client';
import { useDebounce } from '@/lib/use-debounce';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import React, {
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { Input } from '../ui/input';
import { Results } from './results';

const inputVariants = cva(
  'bg-background pl-8 pr-28 text-[#515151] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
  {
    variants: {
      size: {
        default: 'h-12 rounded-3xl pl-8 pr-28 text-lg',
        sm: 'h-9 rounded-2xl pl-8 pr-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface InputSearchAutocompleteProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'default' | 'sm';
  apiBaseUrl: string;
  onSelect: (item: any) => void;
  value: string;
  onChange: (e: any) => void;
  formatResult?: (item: any) => React.ReactNode;
}

interface ResultItem {
  names: string;
  name: {
    cn_name?: string;
    en_name: string;
  };
}

export const InputSearchAutocomplete = forwardRef<
  HTMLInputElement,
  InputSearchAutocompleteProps
>(
  (
    {
      size = 'default',
      apiBaseUrl,
      value,
      onChange,
      onSelect,
      formatResult,
      ...restProps
    },
    ref,
  ) => {
    const [results, setResults] = useState<{
      [key: string]: ResultItem[];
    }>({});
    const [showResults, setShowResults] = useState(false);
    const [focused, setFocused] = useState(false);
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
      const fetchData = async () => {
        if (focused) {
          const res = await fetchCompletions(apiBaseUrl, debouncedValue);
          setResults(res);
          setShowResults(true);
        }
      };

      if (debouncedValue.length >= 2) {
        fetchData();
      } else {
        setResults({});
        setShowResults(false);
      }
    }, [apiBaseUrl, debouncedValue, focused]);

    const hasResults = Object.values(results).some(
      (result) => result.length > 0,
    );

    return (
      <div>
        <Input
          placeholder="请输入..."
          ref={ref}
          className={cn(inputVariants({ size: size }), {
            'rounded-b-none border-b-transparent shadow-lg': showResults,
          })}
          value={value}
          onChange={onChange}
          onFocus={() => {
            setFocused(true);
            if (hasResults) setShowResults(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setFocused(false);
              setShowResults(false);
            }, 100);
          }}
          {...restProps}
        />
        <Results
          size={size}
          show={showResults}
          results={results}
          onClickItem={(item) => {
            onSelect(item);
          }}
          formatResult={(item) => {
            return formatResult
              ? formatResult(item)
              : item.name?.cn_name || item.name.en_name;
          }}
          showNoResults={!hasResults}
          resultStringKeyName="names"
        />
      </div>
    );
  },
);

InputSearchAutocomplete.displayName = 'InputSearchAutocomplete';
