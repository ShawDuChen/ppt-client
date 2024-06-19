import { statusMap } from '@/types/constants';
import { Badge, BadgeProps } from './ui/badge';

export default function StatusTag({
  status,
  map = statusMap,
  variantMap = {
    1: 'success',
    2: 'destructive-contrast',
  },
}: {
  status?: number;
  map?: Record<number, string>;
  variantMap?: Record<number, BadgeProps['variant']>;
}) {
  const label = map[status!];

  const variant = variantMap[status!] || 'secondary';

  return status === undefined || status === null || !label ? null : (
    <Badge variant={variant} className="whitespace-nowrap">
      {label}
    </Badge>
  );
}
