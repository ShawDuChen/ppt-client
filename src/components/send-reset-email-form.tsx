'use client';

import { sendResetEmail } from '@/lib/send-reset-email';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInputWithIcon } from './form-input-with-icon';
import Spinner from './spinner';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { useToast } from './ui/use-toast';

const formSchema = z.object({
  email: z.string().email({
    message: '请输入有效的邮箱地址',
  }),
});

export default function SendResetEmailForm({
  apiBaseUrl,
}: {
  apiBaseUrl: string;
}) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      sendResetEmail(apiBaseUrl, values.email),
    onSuccess: () => {
      toast({
        description: '邮件已发送，请检查您的邮箱',
      });
    },
    onError: (error: any) => {
      toast({
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInputWithIcon
                    type="email"
                    placeholder="请输入邮箱..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Spinner className="mr-2 h-4 w-4" />
            )}
            发送验证邮件
          </Button>
        </form>
      </Form>
    </>
  );
}
