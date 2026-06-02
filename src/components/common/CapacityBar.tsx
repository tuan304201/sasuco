import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CapacityBarProps {
  enrolled: number;
  max: number;
}

export function CapacityBar({ enrolled, max }: CapacityBarProps) {
  const pct = max === 0 ? 0 : Math.round((enrolled / max) * 100);
  return (
    <div className="space-y-1 min-w-[100px]">
      <Progress
        value={pct}
        className={cn('h-2', pct >= 100 && '[&>div]:bg-red-500')}
      />
      <p className="text-xs text-muted-foreground text-right">
        {enrolled}/{max} chỗ
      </p>
    </div>
  );
}
