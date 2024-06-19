# 联动MultipleSelect的示例
```tsx
'use client';
import MultipleSelect from "@/components/multiple-select";
import TreePanel from "@/components/tree-panel/tree-panel";
import { TreeData } from "@/lib/tree-tool";
import treeData, { flatDrugList } from '@/store/drug-tree-store'
import { useState } from "react";

export default function TestPage() {
  const [value, setValue] = useState<string[]>([]);

  const onConfirm = (data: TreeData) => {
    setValue(data?.map((item) => (item.title || item.key)) as string[])
  }

  const onSelectChange = (data: string[]) => {
    setValue(data);
    setSelectedNodes(data.map(item => ({key: item, title: item})) as TreeData)
  }

  const [selectedNodes, setSelectedNodes] = useState<TreeData>([])

  const filterOnDrugStore = (keword: string) => {
    return Promise.resolve(flatDrugList.filter(item => item.key.toString().includes(keword)));
  }
  
  return (
    <div className="flex w-1/2 space-x-2">
      <MultipleSelect
        value={value}
        onChange={onSelectChange}
        remoteFn={filterOnDrugStore}
      />
      <TreePanel
        treeData={treeData}
        selectedNodes={selectedNodes}
        onChange={setSelectedNodes}
        onConfirm={onConfirm}
      />
    </div>
  )
}
```