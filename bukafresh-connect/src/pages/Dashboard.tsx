import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Calendar, 
  CreditCard,
  TrendingUp,
  Clock,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { mockSubscription, mockDeliveries } from '@/data/mockUser';
import { format, formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const nextDelivery = mockDeliveries.find(d => d.status === 'scheduled');
  const daysUntilDelivery = nextDelivery 
    ? formatDistanceToNow(nextDelivery.scheduledDate, { addSuffix: false })
    : null;

  const stats = [
    { label: 'Total Savings', value: '₦45,000', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Orders This Month', value: '4', icon: Package, color: 'text-blue-600' },
    { label: 'Loyalty Points', value: '2,450', icon: Leaf, color: 'text-primary' },
  ];

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your subscription
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-2xl border border-border/50 p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Subscription */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="bg-gradient-hero p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Current Plan</p>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mt-1">
                  {mockSubscription.package.name} Package
                </h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Package className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Monthly Subscription</span>
              <span className="font-medium text-foreground">
                ₦{mockSubscription.deliveryFrequency === 'weekly' 
                  ? mockSubscription.package.weeklyDeliveryPrice.toLocaleString() 
                  : mockSubscription.package.monthlyDeliveryPrice.toLocaleString()
                }/month
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Delivery Day</span>
              <span className="font-medium text-foreground capitalize">
                {mockSubscription.deliveryDay}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                Active
              </span>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/subscription')}
            >
              Manage Subscription
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Next Delivery */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="bg-accent/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Next Delivery</p>
                <h2 className="text-2xl font-display font-bold text-accent-foreground mt-1">
                  {nextDelivery ? format(nextDelivery.scheduledDate, 'EEEE, MMM d') : 'No upcoming delivery'}
                </h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Truck className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="p-6">
            {nextDelivery && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arriving in</p>
                    <p className="font-semibold text-foreground">{daysUntilDelivery}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Items in this delivery:</p>
                  <div className="space-y-2">
                    {nextDelivery.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground">{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                    {nextDelivery.items.length > 3 && (
                      <p className="text-sm text-primary">
                        +{nextDelivery.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => navigate('/dashboard/deliveries')}
            >
              View All Deliveries
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/dashboard/shop')}
            className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Add Items</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/deliveries')}
            className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">Reschedule</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/subscription')}
            className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
              <Truck className="w-6 h-6 text-secondary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">Pause Plan</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/settings')}
            className="flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">Payment</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
