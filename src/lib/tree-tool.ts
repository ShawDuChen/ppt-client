import { TreeProps } from 'rc-tree';
import { DataNode } from 'rc-tree/lib/interface';

export type TreeData = TreeProps['treeData'];

export const flatWithChildren = (data: TreeData = []) => {
  const result: DataNode[] = [];
  const loop = (data: TreeData = []) => {
    data.forEach(item => {
      result.push(item);
      if (item.children && item.children.length) {
        loop(item.children);
      }
    })
  }
  loop(data);
  return result;
}

export const notFirstLevelKeys = (data: TreeData = []) => {
  const secondLevels = data.reduce((prev, curr) => {
    return [...(prev || []), ...(curr.children||[])]
  }, [] as TreeData);
  return flatWithChildren(secondLevels).map(item => item.key);
}

export const transformTitle = (store: TreeData = []) => {
  const loop: (d: TreeData) => TreeData = (store: TreeData) => {
    return store?.map(item => ({
      key: item.key,
      title: item.title || item.key,
      children: item.children && item.children.length ? loop(item.children) : undefined
    }))
  }
  return loop(store) as TreeData;
}
