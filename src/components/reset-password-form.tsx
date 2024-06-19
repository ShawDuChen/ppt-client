'use client';

import { resetPassword } from '@/lib/reset-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInputWithIcon } from './form-input-with-icon';
import Spinner from './spinner';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: '密码至少需要8个字符',
    }),
    confirmPassword: z.string().min(8, {
      message: '密码至少需要8个字符',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export default function ResetPasswordForm({
  token,
  apiBaseUrl,
}: {
  token: string;
  apiBaseUrl: string;
}) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return resetPassword(apiBaseUrl, values.password, token);
    },
    onSuccess: () => {
      router.push('/auth/reset-password/success');
    },
    onError: (error) => {
      toast({
        title: '重置密码失败，请稍后再试',
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      return await mutation.mutateAsync(values);
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInputWithIcon
                    type="password"
                    placeholder="请输入新密码..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInputWithIcon
                    type="password"
                    placeholder="确认密码..."
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
            设置新密码
          </Button>
        </form>
      </Form>

      <FormError error={error} />
    </>
  );
}

function FormError({ error }: { error: string | null }) {
  if (!error) return null;

  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: 'Invalid credentials',
    Default: 'Default Error Message',
  };

  return <p className="text-red-500">{errorMessages[error]}</p>;
}
