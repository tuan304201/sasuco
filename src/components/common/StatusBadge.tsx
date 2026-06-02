import { Badge } from '@/components/ui/badge';
import type { Course } from '@/types';

interface StatusBadgeProps {
  status: Course['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return status === 'open' ? (
    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
      Đang mở
    </Badge>
  ) : (
    <Badge variant="secondary">Đã đóng</Badge>
  );
}
