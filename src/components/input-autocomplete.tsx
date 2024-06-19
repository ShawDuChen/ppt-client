'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input, type InputProps } from '@/components/ui/input';
import { fetchCompletions } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useState } from 'react';

type SimpleCompletionItem = string;
type NameCompletionItem = { names: string; name: { cn_name: string } };

type InputAutocompleteProps = InputProps &
  (
    | {
        category: 'drug' | 'company' | 'target' | 'disease';
        field?: never;
        onCompletionSelect?: (completion: NameCompletionItem) => void;
      }
    | {
        category: 'trial';
        field: string;
        onCompletionSelect?: (completion: SimpleCompletionItem) => void;
      }
  );

const InputAutocomplete = React.forwardRef<
  HTMLInputElement,
  InputAutocompleteProps
>(
  (
    {
      className,
      value,
      category,
      field,
      onChange,
      onCompletionSelect,
      ...restProps
    },
    ref,
  ) => {
    const [stringSuggestions, setStringSuggestions] = useState<
      SimpleCompletionItem[]
    >([]);
    const [nameSuggestions, setNameSuggestions] = useState<
      NameCompletionItem[]
    >([]);

    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      if (!value || (typeof value === 'string' && value.length < 2)) {
        setStringSuggestions([]);
        setNameSuggestions([]);
        setShowSuggestions(false);
      }
    }, [value]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onInputChange = useCallback(
      debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;

        if (keyword.length < 2) {
          setStringSuggestions([]);
          setNameSuggestions([]);
          setShowSuggestions(false);
          return;
        }
        if (field !== undefined && field !== null) {
          const suggestions = await fetchCompletions(
            process.env.NEXT_PUBLIC_API_BASE_URL as string,
            keyword,
            category,
            field,
          );
          setStringSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          const suggestions = await fetchCompletions(
            process.env.NEXT_PUBLIC_API_BASE_URL as string,
            keyword,
            category,
          );
          setNameSuggestions(suggestions);
          setShowSuggestions(true);
        }
      }, 300),
      [],
    );

    return (
      <div className="group relative w-full">
        <Input
          className={cn('w-full', className)}
          value={value}
          ref={ref}
          onFocus={() => {
            if (value && value.toString().length > 2) setShowSuggestions(true);
          }}
          onChange={(e) => {
            onChange?.(e);
            onInputChange(e);
          }}
          {...restProps}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
            }, 200);
          }}
        />

        {showSuggestions &&
          (category === 'trial' ? (
            <SuggestionsView
              itemType="string"
              suggestions={stringSuggestions}
              onSelect={(suggestion) => {
                onCompletionSelect?.(suggestion);
                setStringSuggestions([]);
              }}
            />
          ) : (
            <SuggestionsView
              itemType="name"
              suggestions={nameSuggestions}
              onSelect={(suggestion) => {
                onCompletionSelect?.(suggestion);
                setStringSuggestions([]);
              }}
            />
          ))}
      </div>
    );
  },
);

const SuggestionsView = ({
  itemType,
  suggestions,
  onSelect,
}:
  | {
      itemType: 'string';
      suggestions: SimpleCompletionItem[];
      onSelect?: (suggestion: SimpleCompletionItem) => void;
    }
  | {
      itemType: 'name';
      suggestions: NameCompletionItem[];
      onSelect?: (suggestion: NameCompletionItem) => void;
    }) => {
  if (suggestions.length === 0) {
    return (
      <Card className={cn('absolute top-[calc(100%+4px)] z-20 w-full')}>
        <CardContent className="px-3 py-2 text-sm text-gray-800">
          <p className="text-center">No results</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('absolute top-[calc(100%+4px)] z-20 w-full')}>
      <CardContent className="px-3 py-2 text-sm text-gray-800">
        <ul className="space-y-1">
          {suggestions.map((suggestion) => (
            <li
              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
              key={
                typeof suggestion === 'string'
                  ? suggestion
                  : suggestion?.name?.cn_name
              }
              onClick={() => {
                // @ts-ignore
                onSelect?.(suggestion);
              }}
            >
              {typeof suggestion === 'string'
                ? suggestion
                : suggestion?.name?.cn_name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

InputAutocomplete.displayName = 'InputAutocomplete';

export { InputAutocomplete };
