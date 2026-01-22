import { useState } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Calendar,
  ChevronRight,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockDeliveries } from '@/data/mockUser';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  preparing: { label: 'Preparing', color: 'bg-amber-100 text-amber-700', icon: Package },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-primary/10 text-primary', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: Package },
};

const DashboardDeliveries = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const upcomingDeliveries = mockDeliveries.filter(d => 
    d.status === 'scheduled' || d.status === 'preparing' || d.status === 'out_for_delivery'
  );
  const pastDeliveries = mockDeliveries.filter(d => 
    d.status === 'delivered' || d.status === 'cancelled'
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Deliveries
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your upcoming and past deliveries
          </p>
        </div>

        {/* Upcoming Deliveries */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Upcoming Deliveries</h2>
          
          {upcomingDeliveries.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming deliveries</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery) => {
                const status = statusConfig[delivery.status];
                const StatusIcon = status.icon;
                const isExpanded = selectedDelivery === delivery.id;

                return (
                  <div 
                    key={delivery.id} 
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setSelectedDelivery(isExpanded ? null : delivery.id)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <StatusIcon className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {format(delivery.scheduledDate, 'EEEE, MMMM d')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-xs px-2 py-0.5 rounded-full", status.color)}>
                              {status.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(delivery.scheduledDate, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {/* Delivery Address */}
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">{delivery.address.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {delivery.address.street}, {delivery.address.city}
                            </p>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Items in this delivery:</p>
                          <div className="space-y-2">
                            {delivery.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-foreground">{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Deliveries */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Past Deliveries</h2>
          
          {pastDeliveries.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No past deliveries yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastDeliveries.map((delivery) => {
                const status = statusConfig[delivery.status];
                const StatusIcon = status.icon;

                return (
                  <div 
                    key={delivery.id} 
                    className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", status.color)}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {format(delivery.scheduledDate, 'MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.items.length} items • {formatPrice(
                            delivery.items.reduce((sum, item) => sum + item.price, 0)
                          )}
                        </p>
                      </div>
                    </div>
                    <span className={cn("text-xs px-2 py-1 rounded-full", status.color)}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardDeliveries;
