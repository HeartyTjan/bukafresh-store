import { useState } from 'react';
import { 
  Package, 
  Pause, 
  Play, 
  Calendar, 
  CreditCard, 
  ChevronRight,
  AlertCircle,
  Check,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockSubscription } from '@/data/mockUser';
import { mockPackages } from '@/data/mockProducts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DashboardSubscription = () => {
  const [isPaused, setIsPaused] = useState(mockSubscription.status === 'paused');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = mockSubscription.deliveryFrequency === 'weekly'
    ? mockSubscription.package.weeklyDeliveryPrice
    : mockSubscription.package.monthlyDeliveryPrice;

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Subscription Resumed" : "Subscription Paused",
      description: isPaused 
        ? "Your deliveries will resume from the next scheduled date."
        : "Your subscription is paused. You can resume anytime.",
    });
  };

  const handleUpgrade = (packageId: string) => {
    const newPkg = mockPackages.find(p => p.id === packageId);
    toast({
      title: "Upgrade Requested",
      description: `Your request to upgrade to ${newPkg?.name} has been submitted. You'll receive a WhatsApp message to confirm.`,
    });
    setShowUpgrade(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription plan and preferences
          </p>
        </div>

        {/* Status Alert */}
        {isPaused && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Subscription Paused</p>
              <p className="text-sm text-amber-700">
                Your subscription is currently paused. No deliveries will be made until you resume.
              </p>
            </div>
          </div>
        )}

        {/* Current Plan Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-gradient-hero p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Current Plan</p>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mt-1">
                  {mockSubscription.package.name} Package
                </h2>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                isPaused ? "bg-amber-500 text-white" : "bg-green-500 text-white"
              )}>
                {isPaused ? 'Paused' : 'Active'}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Servings</p>
                  <p className="font-medium text-foreground">{mockSubscription.package.servings}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery</p>
                  <p className="font-medium text-foreground capitalize">{mockSubscription.deliveryFrequency}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <p className="font-medium text-foreground">{formatPrice(currentPrice)}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">What's Included:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockSubscription.package.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button
                variant={isPaused ? "hero" : "outline"}
                onClick={handlePauseToggle}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Subscription
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Subscription
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowUpgrade(!showUpgrade)}>
                <Package className="w-4 h-4 mr-2" />
                {showUpgrade ? 'Hide Plans' : 'Change Plan'}
              </Button>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        {showUpgrade && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Available Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPackages.map((pkg) => {
                const isCurrent = pkg.id === mockSubscription.packageId;
                const price = mockSubscription.deliveryFrequency === 'weekly'
                  ? pkg.weeklyDeliveryPrice
                  : pkg.monthlyDeliveryPrice;

                return (
                  <div
                    key={pkg.id}
                    className={cn(
                      "rounded-xl border p-5 transition-all",
                      isCurrent 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{pkg.name}</h4>
                        <p className="text-sm text-muted-foreground">{pkg.servings}</p>
                      </div>
                      {isCurrent && (
                        <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground mb-4">
                      {formatPrice(price)}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <Button
                      variant={isCurrent ? "outline" : "default"}
                      className="w-full"
                      disabled={isCurrent}
                      onClick={() => handleUpgrade(pkg.id)}
                    >
                      {isCurrent ? 'Current Plan' : 'Switch to this Plan'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Schedule */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Delivery Schedule</h3>
            <Button variant="ghost" size="sm">
              Change Day
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground capitalize">
                Every {mockSubscription.deliveryDay}
              </p>
              <p className="text-sm text-muted-foreground">
                Next delivery: {mockSubscription.nextDeliveryDate.toLocaleDateString('en-NG', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Section */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium text-foreground mb-2">Need to Cancel?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'd hate to see you go! If you're having issues, please contact our support team first.
          </p>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Cancel Subscription
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSubscription;
