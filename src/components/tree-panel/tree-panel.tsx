import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FolderTreeIcon } from 'lucide-react';
import TreeCard from './tree-card';
import { Button, buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { TreeData } from '@/lib/tree-tool';

const TreePanel = (props: {
  value?: string[];
  onConfirm?: (data: TreeData) => void;
  treeData?: TreeData;
  selectedNodes?: TreeData;
  onChange?: (data: TreeData) => void;
}) => {
  const [open, setOpen] = useState(false);

  const confirm = () => {
    setOpen(false);
    props.onConfirm && props.onConfirm(props.selectedNodes);
  };

  const cancel = () => {
    setOpen(false);
    props.value &&
      props.onConfirm &&
      props.onConfirm(props.value.map((item) => ({ key: item, title: item })));
  };
  return (
    <Popover open={open}>
      <PopoverTrigger
        className={cn(buttonVariants())}
        onClick={() => setOpen(true)}
      >
        <FolderTreeIcon />
      </PopoverTrigger>
      <PopoverContent align="end" className={cn('w-full')}>
        <TreeCard
          treeData={props.treeData}
          prefixCls="rc-tree"
          selectedNodes={props.selectedNodes}
          onChange={props.onChange}
        />
        <div className="mt-2 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => cancel()}>
            取消
          </Button>
          <Button onClick={confirm}>确认</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

TreePanel.displayName = 'TreePanel';

export default TreePanel;

/**
 * Example
 */
/*
const TestPage = () => {
  const [value, setValue] = useState<string[]>([]);

  const onConfirm = (data: TreeData) => {
    setValue(data?.map((item) => (item.title || item.key)) as string[])
  }

  return (
    <div className="flex w-1/2 space-x-2">
      <MultipleSelect value={value} onChange={setValue} />
      <TreePanel treeData={treeData} onConfirm={onConfirm} />
    </div>
  )
}
*/
