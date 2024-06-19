import Tree, { TreeProps } from 'rc-tree';
import 'rc-tree/assets/index.css';
import './style.css';
import { Input } from '../ui/input';
import { ChevronDown, ChevronRight, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { notFirstLevelKeys, TreeData } from '@/lib/tree-tool';

interface TreeCardProps extends TreeProps {
  onChange?: (data: TreeData) => void;
  selectedNodes?: TreeData;
}

const switcherIcon: TreeProps['switcherIcon'] = (obj) => {
  if (obj.isLeaf) return null;
  return obj.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />;
};

const TreeCard = (props: TreeCardProps) => {
  const { treeData, selectedNodes, onChange, ...restProps } = props;
  const defaultExpandedKeys = notFirstLevelKeys(treeData);
  const defaultSelectedKeys = selectedNodes?.map(
    (item) => item.key || item.title,
  ) as string[];
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, e) => {
    setSelectedKeys(selectedKeys as string[]);
    onChange && onChange(e.selectedNodes);
  };

  const handleRemove = (key: string) => {
    removeSelected(key);
    removeSelectedNode(key);
  };

  const removeSelected = (key: string) => {
    setSelectedKeys((current) => current.filter((ckey) => ckey !== key));
  };
  const removeSelectedNode = (key: string) => {
    const updated = selectedNodes?.filter((cnode) => cnode.key !== key);
    onChange && onChange(updated);
  };

  const filterTreeNode: TreeProps['filterTreeNode'] = (node) => {
    if (!keyword) return true;
    return `${node.title}`.toLowerCase().includes(keyword.toLowerCase());
  };

  const [keyword, setKeyword] = useState('');

  return (
    <div className="flex space-x-4 px-3 py-2 text-sm text-gray-800">
      <div className="flex-1 space-y-1 rounded-md border px-3 py-2">
        <div>可选项</div>
        <Input
          placeholder="请输入至少两个字符"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Tree
          treeData={treeData}
          checkStrictly
          multiple
          showIcon={false}
          showLine={true}
          defaultExpandParent={false}
          selectedKeys={selectedKeys}
          defaultExpandedKeys={defaultExpandedKeys}
          switcherIcon={switcherIcon}
          filterTreeNode={filterTreeNode}
          onSelect={handleSelect}
          className="max-h-80 overflow-auto"
        />
      </div>
      <div className="space-y-1 rounded-md border px-3 py-2">
        <div>已选项({selectedNodes?.length || 0})</div>
        <div className="max-h-96 space-y-1 overflow-auto">
          {selectedNodes?.map((item) => {
            return (
              <div key={item.key}>
                <Badge>
                  <span>{`${item.title ?? item.key}`}</span>
                  <XIcon
                    size={12}
                    className="ml-1 cursor-pointer"
                    onClick={() => handleRemove(item.key as string)}
                  />
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

TreeCard.displayName = 'TreeCard';

export default TreeCard;
