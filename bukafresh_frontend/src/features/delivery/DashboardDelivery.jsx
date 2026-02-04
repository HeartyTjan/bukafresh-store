import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  CheckCircle,
  Calendar,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useDelivery } from "./api/useDelivery";
import DeliveryTracker from "./component/DeliveryTracker";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@shared/utils/cn";

const statusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-700",
    icon: Calendar,
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-amber-100 text-amber-700",
    icon: Package,
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-primary/10 text-primary",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

const DashboardDelivery = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [cancellingDelivery, setCancellingDelivery] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [activeTab, setActiveTab] = useState("deliveries");

  const {
    upcomingDeliveries,
    pastDeliveries,
    loading,
    error,
    cancelDelivery,
    fetchUpcomingDeliveries,
    fetchPastDeliveries,
  } = useDelivery();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCancelDelivery = async (deliveryId) => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    try {
      await cancelDelivery(deliveryId, cancelReason);
      setCancellingDelivery(null);
      setCancelReason("");
    } catch (error) {
      console.error("Failed to cancel delivery:", error);
    }
  };

  const handleRefresh = () => {
    fetchUpcomingDeliveries();
    fetchPastDeliveries();
  };

  if (
    loading &&
    upcomingDeliveries.length === 0 &&
    pastDeliveries.length === 0
  ) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Deliveries
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your upcoming and past deliveries
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Deliveries
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your upcoming and past deliveries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("deliveries")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "deliveries"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Package className="w-4 h-4 mr-2 inline" />
          My Deliveries
        </button>
        <button
          onClick={() => setActiveTab("tracker")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors",
            activeTab === "tracker"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Search className="w-4 h-4 mr-2 inline" />
          Track Delivery
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">Error loading deliveries</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "tracker" ? (
        <DeliveryTracker />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Deliveries */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Deliveries
            </h2>

            {upcomingDeliveries.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming deliveries</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingDeliveries.map((delivery) => {
                  const status = statusConfig[delivery.status];
                  const StatusIcon = status?.icon || Package;
                  const isExpanded = selectedDelivery === delivery.id;

                  return (
                    <div
                      key={delivery.id}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setSelectedDelivery(isExpanded ? null : delivery.id)
                        }
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <StatusIcon className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {format(
                                new Date(delivery.scheduledDate),
                                "EEEE, MMMM d",
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  status?.color || "bg-gray-100 text-gray-700",
                                )}
                              >
                                {status?.label || delivery.status}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(delivery.scheduledDate),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                              </span>
                              {delivery.trackingNumber && (
                                <span className="text-xs text-muted-foreground">
                                  #{delivery.trackingNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform",
                            isExpanded && "rotate-90",
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                          {/* Delivery Address */}
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground">
                                {delivery.deliveryAddress?.label ||
                                  "Delivery Address"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {delivery.deliveryAddress?.street},{" "}
                                {delivery.deliveryAddress?.city}
                              </p>
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">
                              Items in this delivery:
                            </p>
                            <div className="space-y-2">
                              {delivery.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {item.quantity} {item.unit} {item.name}
                                  </span>
                                  <span className="text-foreground">
                                    {formatPrice(item.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-2">
                            {delivery.status === "SCHEDULED" && (
                              <>
                                {/* <Button variant="outline" size="sm">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Reschedule
                                </Button> */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setCancellingDelivery(delivery.id)
                                  }
                                >
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            {/* <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact Support
                            </Button> */}
                          </div>

                          {/* Cancel Delivery Modal */}
                          {cancellingDelivery === delivery.id && (
                            <div className="mt-4 p-4 border border-red-200 rounded-lg bg-red-50">
                              <h4 className="font-medium text-red-800 mb-2">
                                Cancel Delivery
                              </h4>
                              <textarea
                                value={cancelReason}
                                onChange={(e) =>
                                  setCancelReason(e.target.value)
                                }
                                placeholder="Please provide a reason for cancellation..."
                                className="w-full p-2 border border-red-300 rounded text-sm"
                                rows={3}
                              />
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleCancelDelivery(delivery.id)
                                  }
                                  disabled={loading}
                                >
                                  Confirm Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCancellingDelivery(null);
                                    setCancelReason("");
                                  }}
                                >
                                  Keep Delivery
                                </Button>
                              </div>
                            </div>
                          )}
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
            <h2 className="text-lg font-semibold text-foreground">
              Past Deliveries
            </h2>

            {pastDeliveries.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past deliveries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastDeliveries.map((delivery) => {
                  const status = statusConfig[delivery.status];
                  const StatusIcon = status?.icon || Package;

                  return (
                    <div
                      key={delivery.id}
                      className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            status?.color || "bg-gray-100 text-gray-700",
                          )}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {format(
                              new Date(delivery.scheduledDate),
                              "MMMM d, yyyy",
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.items?.length || 0} items •{" "}
                            {formatPrice(
                              delivery.items?.reduce(
                                (sum, item) => sum + (item.price || 0),
                                0,
                              ) || 0,
                            )}
                          </p>
                          {delivery.trackingNumber && (
                            <p className="text-xs text-muted-foreground">
                              Tracking: {delivery.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          status?.color || "bg-gray-100 text-gray-700",
                        )}
                      >
                        {status?.label || delivery.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDelivery;
