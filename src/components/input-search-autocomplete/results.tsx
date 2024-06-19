'use client';

import { cn } from '@/lib/utils';
import {
  BiohazardIcon,
  Building2Icon,
  CrosshairIcon,
  PillIcon,
} from 'lucide-react';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export type Item<T> = T & { [key: string]: any };

interface ResultsProps<T> {
  size?: 'default' | 'sm';
  results: {
    [key: string]: Item<T>[];
  };
  show?: boolean;
  onClickItem?: (item: Item<T>) => void;
  formatResult?: (item: Item<T>) => React.ReactNode;
  showNoResults?: boolean;
  showNoResultsMessage?: string;
  resultStringKeyName?: string;
}

export function Results<T>({
  size = 'default',
  results,
  show,
  onClickItem,
  formatResult,
  showNoResults = true,
  showNoResultsMessage = '无结果',
  resultStringKeyName = 'name',
}: ResultsProps<T>) {
  const hasResults = Object.values(results).some((result) => result.length > 0);

  if (!show) {
    return null;
  }

  if (showNoResults) {
    return (
      <div
        className={cn(
          'absolute z-20 w-full border border-t-0 bg-background shadow-lg',
          {
            'rounded-b-3xl pb-4': size === 'default',
            'rounded-b-2xl pb-2': size === 'sm',
          },
        )}
      >
        <div
          className={cn({
            'px-4': size === 'default',
            'px-3': size === 'sm',
          })}
        >
          <Separator
            className={cn({
              'mb-4': size === 'default',
              'mb-1': size === 'sm',
            })}
          />
          <div
            className={cn('pb-4 pl-5 pt-4 text-gray-400', {
              'text-sm': size === 'sm',
            })}
          >
            {!hasResults && showNoResultsMessage}
          </div>
        </div>
      </div>
    );
  }

  if (!hasResults && !showNoResults) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute z-20 w-full border border-t-0 bg-background shadow-lg',
        {
          'rounded-b-3xl pb-4': size === 'default',
          'rounded-b-2xl pb-2': size === 'sm',
        },
      )}
    >
      <ScrollArea
        className={cn('h-fit max-h-[400px]', {
          'px-4': size === 'default',
          'px-3': size === 'sm',
        })}
      >
        <Separator
          className={cn({
            'mb-4': size === 'default',
            'mb-1': size === 'sm',
          })}
        />

        {[
          { name: 'drug', items: results.drug, icon: PillIcon },
          { name: 'company', items: results.company, icon: Building2Icon },
          { name: 'target', items: results.target, icon: CrosshairIcon },
          { name: 'disease', items: results.disease, icon: BiohazardIcon },
        ]
          .filter((section) => section.items.length > 0)
          .map((section, index) => (
            <div key={section.name}>
              {index !== 0 && <Separator className="my-2" />}
              <Section
                items={section.items}
                icon={
                  <section.icon
                    className={cn('mt-1', {
                      'h-5 w-5': size === 'default',
                      'h-4 w-4': size === 'sm',
                    })}
                  />
                }
                itemKeyName={resultStringKeyName}
                formatItem={formatResult}
                onClickItem={onClickItem}
              />
            </div>
          ))}
      </ScrollArea>
    </div>
  );
}

interface SectionProps<T> {
  items: Item<T>[];
  itemKeyName: string;
  formatItem?: (item: Item<T>) => React.ReactNode;
  onClickItem?: (item: Item<T>) => void;
  icon: React.ReactNode;
}

const Section = <T,>({
  items,
  itemKeyName,
  formatItem,
  onClickItem,
  icon,
}: SectionProps<T>) => {
  return (
    <div className="flex">
      <div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="ml-1 flex-grow">
        {items.map((item) => (
          <div
            key={item.id || item?.[itemKeyName]}
            onClick={() => onClickItem?.(item)}
          >
            {formatItem ? formatItem(item) : item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
