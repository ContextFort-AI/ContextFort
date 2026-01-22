import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down';
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'error';
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  variant = 'default',
  description,
}: StatCardProps) {
  const variantStyles = {
    default: '',
    success: 'border-green-500/20 bg-green-500/5',
    error: 'border-red-500/20 bg-red-500/5',
  };

  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <Card className={cn(variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {(change !== undefined || description) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {change !== undefined && (
              <span className={cn('flex items-center', trendColor)}>
                <TrendIcon className="mr-1 h-3 w-3" />
                {Math.abs(change)}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
