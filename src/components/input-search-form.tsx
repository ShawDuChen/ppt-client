'use client';

import { FC, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { cva } from 'class-variance-authority';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InputSearchAutocomplete } from './input-search-autocomplete/input-search-autocomplete';

interface InputSearchFormProps {
  showHotKeywords?: boolean;
  size?: 'default' | 'sm';
  apiBaseURL: string;
}

const searchButtonVariants = cva(
  "absolute right-0 top-0 z-10 rounded-l-none rounded-r-3xl border border-l-0 border-transparent bg-transparent pl-4 pr-5 after:absolute after:left-0 after:h-8 after:w-px after:bg-border after:content-['']",
  {
    variants: {
      size: {
        default: 'h-12 pl-4 pr-5',
        sm: 'h-9 px-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const clearButtonVariants = cva(
  'absolute top-0 w-12 rounded-full hover:bg-inherit hover:text-red-500',
  {
    variants: {
      size: {
        default: 'right-16 h-12 w-12 p-1',
        sm: 'right-10 h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const formSchema = z.object({
  keyword: z
    .string()
    .min(2, { message: '请至少输入两个字符' })
    .max(50, { message: '最多输入50个字符' }),
});

const hotKeywords = ['奥希替尼', 'PD-1', '非小细胞肺癌', 'pfizer'];

const InputSearchForm: FC<InputSearchFormProps> = ({
  showHotKeywords = true,
  size = 'default',
  apiBaseURL,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
    },
  });

  const keyword = form.watch('keyword');

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('keyword', values.keyword);

    inputRef.current?.blur();

    router.push(`/search?${newSearchParams.toString()}`);
  }

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) form.setValue('keyword', keyword);
  }, [form, searchParams]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('group relative z-10 rounded-3xl')}
      >
        <FormField
          control={form.control}
          name="keyword"
          render={({ field: { ref, onChange, onBlur, ...rest } }) => (
            <FormItem className="relative z-10">
              <FormControl>
                <InputSearchAutocomplete
                  autoFocus={!keyword && !searchParams.get('keyword')}
                  ref={(e) => {
                    ref(e);
                    inputRef.current = e;
                  }}
                  size={size}
                  apiBaseUrl={apiBaseURL}
                  onSelect={(item) => {
                    form.setValue('keyword', item.name.cn_name);
                    form.handleSubmit(onSubmit)();
                  }}
                  value={rest.value}
                  onChange={onChange}
                  formatResult={(item) => {
                    return (
                      <div
                        className={cn(
                          'cursor-pointer rounded-sm text-muted-foreground hover:bg-gray-100',
                          {
                            'px-2 py-1 text-base': size === 'default',
                            'px-1 py-1 text-sm': size === 'sm',
                          },
                        )}
                      >
                        {item.name?.cn_name || item.name.en_name}
                      </div>
                    );
                  }}
                />
              </FormControl>
              {/* <FormMessage
                className={cn('absolute', {
                  'ml-8': size === 'default',
                  'ml-3 text-xs': size === 'sm',
                })}
              /> */}
            </FormItem>
          )}
        />

        {/* Search Button */}
        <Button
          variant="outline"
          className={cn(searchButtonVariants({ size }))}
          type="submit"
        >
          <SearchIcon
            className={cn('text-primary', {
              'h-5 w-5': size === 'default',
              'h-4 w-4': size === 'sm',
            })}
          />
        </Button>

        {/* Clear Button */}
        {keyword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(clearButtonVariants({ size }))}
            onClick={() => {
              form.resetField('keyword');
              form.setFocus('keyword');
            }}
          >
            <XIcon
              className={cn('mt-0', {
                'h-5 w-5': size === 'default',
                'h-3 w-3': size === 'sm',
              })}
            />
          </Button>
        )}

        {/* Hot keywords */}
        {showHotKeywords && (
          <div className="z-0 ml-px mt-4 pl-8 text-muted-foreground">
            <span>热门搜索：</span>
            <div className="ml-4 inline-flex flex-wrap gap-4">
              {hotKeywords.map((item) => (
                <Button
                  type="button" // prevent form submit
                  key={item}
                  variant="link"
                  className="px-0 py-0 text-muted-foreground"
                  onClick={() => {
                    form.setValue('keyword', item);
                    form.handleSubmit(onSubmit)();
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

export default InputSearchForm;
