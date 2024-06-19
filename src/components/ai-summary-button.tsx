import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { randomPickArrayItem } from '@/lib/utils';
import { DrugAISummary } from '@/types';
import { HelpCircleIcon, LayersIcon } from 'lucide-react';

export default function AISummaryButton({
  contents,
  title,
  badge,
}: {
  contents?: DrugAISummary[];
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) {
  if (!contents || contents.length === 0) {
    return (
      <Button size="sm" disabled variant="outline">
        <LayersIcon size={16} className="mr-2" />
        AI Summary
      </Button>
    );
  }

  const chosenContent = randomPickArrayItem(contents);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" className="relative">
          <LayersIcon size={16} className="mr-2" />
          AI Summary
          <span className="absolute -right-4 -top-4">{badge}</span>
          <span className="sr-only">AI Summary</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        showOverlay={false}
        className="bottom-auto top-20 flex max-h-[600px] flex-col overflow-hidden rounded-l-lg p-0"
      >
        <SheetHeader className="bg-primary px-6 py-4">
          <SheetTitle className="flex items-center bg-primary text-base text-primary-foreground">
            <LayersIcon size={24} className="mr-5" />
            AI Summary
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow p-6">
          <SheetDescription asChild>
            <div>
              {title}
              <div className="space-y-6">
                {chosenContent.map((item) => (
                  <div key={item.name}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">
                      {item.name}
                    </h3>
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </SheetDescription>
        </ScrollArea>
        <SheetFooter className="bg-primary px-6 py-4 text-primary-foreground">
          {/* TODO: fix hover card */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="h-auto text-primary-foreground"
              >
                帮助
                <HelpCircleIcon size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-10 w-80">
              本页面的内容由 AI 生成，仅供参考。
            </PopoverContent>
          </Popover>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
