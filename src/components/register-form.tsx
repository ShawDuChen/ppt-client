'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Spinner from './spinner';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { FormInputWithIcon } from './form-input-with-icon';

const formSchema = z
  .object({
    email: z.string().email({
      message: '请输入有效的邮箱地址',
    }),
    password: z.string().min(8, {
      message: '密码至少需要8个字符',
    }),
    confirmPassword: z.string().min(8, {
      message: '密码至少需要8个字符',
    }),
    name: z.string().min(2, {
      message: '姓名至少需要两个字符',
    }),
    company: z.string().min(2, {
      message: '公司名称至少需要两个字符',
    }),
    jobTitle: z.string().min(2, {
      message: '职位名称至少需要两个字符',
    }),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({
        message: '请同意服务条款',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      company: '',
      jobTitle: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const credentials = {
      email: values.email,
      password: values.password,
      name: values.name,
      company: values.company,
      jobTitle: values.jobTitle,
    };

    await signIn('register', { ...credentials, redirect: false });
    router.push('/register-success');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="items-center justify-between gap-4 md:flex">
                <FormLabel className="w-20 text-right">邮箱地址</FormLabel>
                <FormControl>
                  <FormInputWithIcon
                    type="email"
                    placeholder="请输入邮箱地址..."
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="items-center justify-between gap-4 md:flex">
                <FormLabel className="w-20 text-right">密码</FormLabel>
                <FormControl>
                  <FormInputWithIcon
                    type="password"
                    placeholder="请输入密码..."
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <div className="items-center justify-between gap-4 md:flex">
                <FormLabel className="w-20 text-right">确认密码</FormLabel>
                <FormControl>
                  <FormInputWithIcon
                    type="password"
                    placeholder="确认密码..."
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-center justify-between gap-4 md:flex">
                  <FormLabel className="w-20 text-right">姓名</FormLabel>
                  <FormInputWithIcon placeholder="请输入姓名..." {...field} />
                </div>
              </FormControl>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-center justify-between gap-4 md:flex">
                  <FormLabel className="w-20 text-right">公司</FormLabel>
                  <FormInputWithIcon
                    placeholder="请输入公司名称..."
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="items-center justify-between gap-4 md:flex">
                  <FormLabel className="w-20 text-right">职位</FormLabel>
                  <FormInputWithIcon placeholder="请输入职位..." {...field} />
                </div>
              </FormControl>
              <FormMessage className="ml-24" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <FormItem className="pt-8">
              <div className="flex items-center space-x-4 space-y-0">
                <FormControl>
                  <Checkbox
                    className="border-none bg-[#EAEDEF] text-primary focus:ring-primary"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="cursor-pointer text-gray-500">
                    我已阅读并同意{' '}
                    <Link
                      href="/terms-of-service"
                      className="text-primary hover:underline"
                    >
                      用户服务协议
                    </Link>
                  </FormLabel>
                </div>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
          注册
        </Button>
      </form>
    </Form>
  );
}
