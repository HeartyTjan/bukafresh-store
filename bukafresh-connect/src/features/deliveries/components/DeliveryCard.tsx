import { Truck, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Delivery } from '@/types';
import { cn } from '@/lib/utils';

interface DeliveryCardProps {
  delivery: Delivery;
  onTrack?: (deliveryId: string) => void;
  onReschedule?: (deliveryId: string) => void;
}

const statusConfig = {
  scheduled: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Scheduled' },
  preparing: { icon: Truck, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Preparing' },
  out_for_delivery: { icon: Truck, color: 'text-primary', bg: 'bg-primary/10', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: Clock, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelled' },
};

export function DeliveryCard({
  delivery,
  onTrack,
  onReschedule,
}: DeliveryCardProps) {
  const config = statusConfig[delivery.status];
  const StatusIcon = config.icon;
  const scheduledDate = new Date(delivery.scheduledDate);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
            <StatusIcon className={cn("w-4 h-4", config.color)} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {scheduledDate.toLocaleDateString('en-NG', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className={cn("text-xs font-medium", config.color)}>{config.label}</p>
          </div>
        </div>
        {delivery.status === 'out_for_delivery' && delivery.trackingInfo && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">ETA</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(delivery.trackingInfo.estimatedArrival).toLocaleTimeString('en-NG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{delivery.address.street}, {delivery.address.city}</span>
      </div>

      <div className="text-sm text-muted-foreground">
        {delivery.items.length} items in this delivery
      </div>

      {(onTrack || onReschedule) && delivery.status !== 'delivered' && delivery.status !== 'cancelled' && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          {onTrack && delivery.status === 'out_for_delivery' && (
            <button
              onClick={() => onTrack(delivery.id)}
              className="text-sm text-primary font-medium hover:underline"
            >
              Track Delivery
            </button>
          )}
          {onReschedule && delivery.status === 'scheduled' && (
            <button
              onClick={() => onReschedule(delivery.id)}
              className="text-sm text-primary font-medium hover:underline"
            >
              Reschedule
            </button>
          )}
        </div>
      )}
    </div>
  );
}