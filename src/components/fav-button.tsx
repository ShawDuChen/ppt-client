'use client';

import CreateFolderDialog from '@/app/workspace/create-folder-dialog';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import fetchClient from '@/lib/fetch-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderPlusIcon, StarIcon } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SelectFolder from './select-folder';

interface FavButtonProps {
  apiBaseUrl: string;
  trigger?: React.ReactNode;
  initialValues?: {
    note?: string;
  };
}

const addFav = async (
  apiBaseUrl: string,
  folderId: number,
  note: string,
  url: string,
) => {
  const resp = await fetchClient({
    url: apiBaseUrl + '/workspace/favorites',
    method: 'POST',
    body: JSON.stringify({
      parent_id: folderId,
      note,
      url,
    }),
  });

  const result = await resp.json();

  return result;
};

const formSchema = z.object({
  folder_id: z.number(),
  note: z.string().optional(),
});

const FavButton = ({ apiBaseUrl, trigger, initialValues }: FavButtonProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema> & { url: string }) => {
      const { folder_id, note, url } = data;
      return addFav(apiBaseUrl, folder_id, note || '', url);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: '收藏失败',
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: '收藏成功',
      });
      queryClient.invalidateQueries({
        queryKey: ['listDir', variables.folder_id],
      });
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: initialValues?.note || '',
      folder_id: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let url = `${pathname}`;
      if (searchParams.size > 0) {
        url += `?${searchParams.toString()}`;
      }
      return await mutation.mutateAsync({
        ...values,
        url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="text-primary/50">
            <StarIcon size={16} className="mr-2" />
            收藏
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton showOverlay={false}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="mb-4">
              <DialogTitle>收藏到工作空间</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="folder_id"
                render={({ field }) => (
                  <FormItem className="items-center gap-4">
                    <Label htmlFor="folder_id" className="text-right">
                      文件夹
                    </Label>
                    <div>
                      <SelectFolder {...field} />
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="items-center gap-4">
                    <Label htmlFor="note" className="text-right">
                      备注
                    </Label>
                    <div>
                      <Textarea
                        {...field}
                        id="note"
                        placeholder="请输入收藏备注"
                      />
                      <FormMessage className="mt-2" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-between">
              <CreateFolderDialog
                trigger={
                  <Button type="button" variant="secondary" onClick={() => {}}>
                    <FolderPlusIcon className="mr-2 h-4 w-4" />
                    新建文件夹
                  </Button>
                }
                parent_id={form.watch('folder_id')}
                showOverlay={false}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Spinner className="mr-2 h-4 w-4" />
                )}
                收藏到此处
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FavButton;
