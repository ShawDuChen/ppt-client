'use client';

import { zhCN } from 'date-fns/locale';
import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  CaptionProps,
  DayPicker,
  useDayPicker,
  useNavigation,
} from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { add, format } from 'date-fns';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CustomCaptionComponent(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth, goToDate } = useNavigation();
  const { numberOfMonths } = useDayPicker();

  const previousYear = add(props.displayMonth, { years: -1 });
  const nextYear = add(props.displayMonth, { years: 1 });

  return (
    <div className="relative flex w-full items-center space-x-1">
      {props.displayIndex === 0 && (
        <div className="absolute left-0 flex gap-2">
          <button
            title="Go to previous year"
            onClick={() => goToDate(new Date(previousYear))}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            disabled={!previousMonth}
            onClick={() => previousMonth && goToMonth(previousMonth)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex-1 text-center">
        {format(props.displayMonth, 'yyy MMM', { locale: zhCN })}
      </div>

      {props.displayIndex === numberOfMonths - 1 && (
        <div className="absolute right-0 flex gap-2">
          <button
            disabled={!nextMonth}
            onClick={() => nextMonth && goToMonth(nextMonth)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            title="Go to next year"
            onClick={() => goToDate(new Date(nextYear))}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = zhCN,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaptionComponent,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
