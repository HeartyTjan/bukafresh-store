import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '@/types';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
  formatPrice: (price: number) => string;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pending' },
  confirmed: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

export function OrderCard({
  order,
  onViewDetails,
  onReorder,
  formatPrice,
}: OrderCardProps) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;
  const createdDate = new Date(order.createdAt);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-foreground">Order #{order.id.slice(-8)}</p>
          <p className="text-sm text-muted-foreground">
            {createdDate.toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium", config.bg, config.color)}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{order.items.length} items</span>
          <span className="text-muted-foreground capitalize">{order.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Total</span>
          <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
        </div>
      </div>

      {(onViewDetails || onReorder) && (
        <div className="flex gap-3 pt-3 border-t border-border">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(order.id)}
              className="text-sm text-primary font-medium hover:underline"
            >
              View Details
            </button>
          )}
          {onReorder && order.status === 'delivered' && (
            <button
              onClick={() => onReorder(order.id)}
              className="text-sm text-primary font-medium hover:underline"
            >
              Reorder
            </button>
          )}
        </div>
      )}
    </div>
  );
}