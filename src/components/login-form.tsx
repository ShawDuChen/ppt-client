'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormInputWithIcon } from './form-input-with-icon';
import Spinner from './spinner';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';

const formSchema = z.object({
  email: z.string().email({
    message: '请输入有效的邮箱地址',
  }),
  password: z.string().min(8, {
    message: '密码至少需要8个字符',
  }),
});

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const credentials = values;
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    await signIn('credentials', { ...credentials, callbackUrl });
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
                    leftIcon={<MailIcon className="h-4 w-4" />}
                    type="email"
                    placeholder="请输入邮箱..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FormInputWithIcon
                    leftIcon={<LockIcon className="h-4 w-4" />}
                    type="password"
                    placeholder="请输入密码..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="mb-2">
              登录即代表同意{' '}
              <Link
                href="/terms-of-service"
                className="text-primary hover:underline"
              >
                用户服务协议
              </Link>
            </p>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Spinner className="mr-2 h-4 w-4" />
              )}
              登录
            </Button>
          </div>
        </form>
      </Form>

      <FormError error={error} />
    </>
  );
}

function FormError({ error }: { error: string | null }) {
  if (!error) return null;

  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: '邮箱或密码错误',
    Default: '遇到了一些错误，请稍后再试',
  };

  return <p className="my-2 text-red-500">{errorMessages[error]}</p>;
}
