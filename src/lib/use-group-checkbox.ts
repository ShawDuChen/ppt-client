import { GroupColumnKey } from '@/app/search/(category)/custom-columns-button';
import { CheckedState } from '@radix-ui/react-checkbox';
import { intersection } from 'lodash-es';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useGroupCheckboxState = (
  form: UseFormReturn<any>,
  groupColumnKeys?: GroupColumnKey[],
) => {
  const [groupCheckState, setGroupCheckState] = useState<CheckedState[]>([]);
  const onGroupCheckChange = (groupIndex: number) => {
    const values = form.getValues('columns');
    const keys = groupColumnKeys?.[groupIndex].keys
      .filter((item) => !item.forceChecked)
      .map((item) => item.key);
    const forceCheckedKeys = groupColumnKeys?.[groupIndex].keys
      .filter((item) => item.forceChecked)
      .map((item) => item.key);
    const intersectionKeys = intersection(keys, values);
    let newValues: string[] = [];
    let newGroupChecked: CheckedState = false;
    if (!intersectionKeys.length) {
      newValues = [...values, ...(keys || [])];
      newGroupChecked = true;
    } else if (intersectionKeys.length === keys?.length) {
      newValues = values.filter((item: string) => !keys?.includes(item));
      newGroupChecked = forceCheckedKeys?.length ? 'indeterminate' : false;
    } else {
      newValues = [
        ...values,
        ...(keys?.filter((item) => !intersectionKeys.includes(item)) || []),
      ];
      newGroupChecked = true;
    }
    form.setValue('columns', newValues);
    setGroupCheckState((prev) => {
      const newState = [...prev];
      newState[groupIndex] = newGroupChecked;
      return newState;
    });
  };

  const updatedGroupCheckState = () => {
    requestAnimationFrame(() => {
      const newCheckState = groupColumnKeys?.map((item) => {
        const values = form.getValues('columns');
        const keys = item.keys
          .filter((item) => !item.forceChecked)
          .map((item) => item.key);
        const forceCheckedKeys = item.keys
          .filter((item) => item.forceChecked)
          .map((item) => item.key);
        const intersectionKeys = intersection(keys, values);
        let newGroupChecked: CheckedState = false;
        if (!intersectionKeys.length) {
          newGroupChecked = forceCheckedKeys?.length ? 'indeterminate' : false;
        } else if (intersectionKeys.length === keys?.length) {
          newGroupChecked = true;
        } else {
          newGroupChecked = 'indeterminate';
        }
        return newGroupChecked;
      });
      setGroupCheckState(newCheckState || []);
    });
  };

  useEffect(() => {
    updatedGroupCheckState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    groupCheckState,
    onGroupCheckChange,
    updatedGroupCheckState,
  };
};
