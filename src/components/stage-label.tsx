import { stageMap } from '@/types/constants';
import { HTMLAttributes } from 'react';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

type StageLabelType =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive';

export default function StageLabel({
  className,
  stage,
}: {
  className?: HTMLAttributes<HTMLElement>['className'];
  stage: number;
}) {
  const types: Record<StageLabelType, string> = {
    default: 'text-gray-500 before:bg-gray-500',
    primary: 'text-primary before:bg-primary',
    success: 'text-success-foreground before:bg-success-foreground',
    warning: 'text-warning before:bg-warning',
    destructive: 'text-destructive before:bg-destructive',
  };

  const label = stageMap[stage];

  const getType = (stage: number) => {
    if ([6, 7, 8, 9, 10, 11, 12].includes(stage)) {
      return types.primary;
    }
    if ([14].includes(stage)) {
      return types.success;
    }
    if ([3, 13].includes(stage)) {
      return types.destructive;
    }
    if ([2, 4, 5].includes(stage)) {
      return types.warning;
    }
    return types.default;
  };

  return (
    <Label
      className={cn(
        'flex items-center whitespace-nowrap text-sm before:mr-2 before:inline-block before:h-1 before:w-1 before:rounded',
        getType(stage),
        className,
      )}
    >
      {label || '-'}
    </Label>
  );
}
