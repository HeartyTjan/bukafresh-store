import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useAuth } from "@/auth/api/AuthProvider";
import { useUserProfile } from "@/auth/api/useUserProfile";
import { useSubscription } from "@/features/subscription/api/useSubscription";

const Overview = () => {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  console.log("subscription in overview", subscription);

  const stats = [
    {
      label: "Amount spent",
      value: "₦45,000",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Orders This Month",
      value: "4",
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Loyalty Points",
      value: "2,450",
      icon: Leaf,
      color: "text-primary",
    },
  ];

  const getDaysUntilDelivery = (date) => {
    const today = new Date();
    const deliveryDate = new Date(date);
    const diffTime = deliveryDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Welcome back
          {profileLoading ? "!" : `, ${profile?.data?.firstName || "User"}!`}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your subscription
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Delivery */}
      <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 overflow-hidden">
        {subscriptionLoading ? (
          <div className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        ) : subscription && subscription.status === "ACTIVE" ? (
          <>
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">
                    Next Delivery
                  </p>
                  <h2 className="text-lg sm:text-2xl font-display font-bold text-white mt-1">
                    {new Date(subscription.nextDeliveryDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </h2>
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center">
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Arriving in
                  </p>
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    {getDaysUntilDelivery(subscription.nextDeliveryDate)} days
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Items in this delivery:
                </p>

                <div className="text-center text-sm text-muted-foreground">
                  Your delivery includes fresh groceries tailored to your plan.
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
                onClick={() => navigate("/dashboard/deliveries")}
              >
                View All Deliveries
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          // No subscription or pending
          <div className="p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Upcoming Deliveries
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {subscription?.status === "PENDING"
                ? "Your subscription is pending. Delivery will start once your plan is active."
                : "Choose a subscription plan to start receiving deliveries"}
            </p>
            {subscription?.status == "PENDING" ||
              (!subscription && (
                <Button
                  onClick={() => navigate("/dashboard/subscription")}
                  className="w-50"
                >
                  Choose a Plan
                </Button>
              ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/dashboard/shop")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Add Items
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/deliveries")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Reschedule
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/subscription")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Pause Plan
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/payment")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Payment
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
