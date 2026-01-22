import { 
  Package, 
  Calendar, 
  CreditCard, 
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useOrders } from '@/context/OrdersContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

const DashboardOrders = () => {
  const { orders, getOrderStats } = useOrders();
  const stats = getOrderStats();
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Order History
            </h1>
            <p className="text-muted-foreground mt-1">
              View all your past orders and invoices
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(stats.totalSpent)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.deliveredCount}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">All Orders</h2>

          {orders.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const status = statusConfig[order.status];

                return (
                  <div 
                    key={order.id} 
                    className="bg-card rounded-xl border border-border p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              Order #{order.id.slice(-6).toUpperCase()}
                            </p>
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full capitalize",
                              order.type === 'subscription' 
                                ? 'bg-primary/10 text-primary' 
                                : 'bg-accent text-accent-foreground'
                            )}>
                              {order.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(order.createdAt, 'MMMM d, yyyy')} • {order.items.length} items
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-muted px-2 py-0.5 rounded"
                              >
                                {item.name}
                              </span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{order.items.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-16 md:ml-0">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(order.total)}
                          </p>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", status.color)}>
                            {status.label}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
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

export default DashboardOrders;
