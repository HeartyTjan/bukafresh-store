import { useState } from "react";
import { Search, Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { useDelivery } from "../api/useDelivery";
import { format } from "date-fns";
import { cn } from "@shared/utils/cn";

const statusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
    description: "Your delivery has been scheduled",
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-amber-100 text-amber-700",
    icon: Package,
    description: "Your order is being prepared",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-primary/10 text-primary",
    icon: Truck,
    description: "Your order is on the way",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    description: "Your order has been delivered",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    description: "Your delivery was cancelled",
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    description: "Delivery failed",
  },
};

const DeliveryTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [trackingError, setTrackingError] = useState(null);
  
  const { trackDelivery, loading } = useDelivery();

  const handleTrackDelivery = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setTrackingError(null);
    setTrackedDelivery(null);

    try {
      const delivery = await trackDelivery(trackingNumber.trim());
      setTrackedDelivery(delivery);
    } catch (error) {
      setTrackingError("Delivery not found. Please check your tracking number.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Tracking Form */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Track Your Delivery
        </h2>
        <form onSubmit={handleTrackDelivery} className="flex gap-3">
          <Input
            type="text"
            placeholder="Enter tracking number (e.g., BF1234567890AB)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !trackingNumber.trim()}>
            <Search className="w-4 h-4 mr-2" />
            Track
          </Button>
        </form>
      </div>

      {/* Tracking Error */}
      {trackingError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">Tracking Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{trackingError}</p>
        </div>
      )}

      {/* Tracking Results */}
      {trackedDelivery && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Tracking: {trackedDelivery.trackingNumber}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Scheduled for {format(new Date(trackedDelivery.scheduledDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="text-right">
                {(() => {
                  const status = statusConfig[trackedDelivery.status];
                  const StatusIcon = status?.icon || Package;
                  return (
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-5 h-5 text-primary" />
                      <span
                        className={cn(
                          "text-sm px-3 py-1 rounded-full font-medium",
                          status?.color || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {status?.label || trackedDelivery.status}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {trackedDelivery.deliveryAddress && (
            <div className="p-6 border-b border-border">
              <h4 className="font-medium text-foreground mb-2">Delivery Address</h4>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">{trackedDelivery.deliveryAddress.label}</p>
                <p>{trackedDelivery.deliveryAddress.street}</p>
                <p>{trackedDelivery.deliveryAddress.city}, {trackedDelivery.deliveryAddress.state}</p>
              </div>
            </div>
          )}

          {/* Driver Information */}
          {trackedDelivery.driverName && (
            <div className="p-6 border-b border-border">
              <h4 className="font-medium text-foreground mb-2">Driver Information</h4>
              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">Name:</span> {trackedDelivery.driverName}</p>
                {trackedDelivery.driverPhone && (
                  <p><span className="font-medium">Phone:</span> {trackedDelivery.driverPhone}</p>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          {trackedDelivery.items && trackedDelivery.items.length > 0 && (
            <div className="p-6">
              <h4 className="font-medium text-foreground mb-3">Items in this delivery</h4>
              <div className="space-y-2">
                {trackedDelivery.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unit} {item.name}
                    </span>
                    <span className="text-foreground font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        trackedDelivery.items.reduce((sum, item) => sum + item.price, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Notes */}
          {trackedDelivery.deliveryNotes && (
            <div className="p-6 border-t border-border bg-muted/30">
              <h4 className="font-medium text-foreground mb-2">Delivery Notes</h4>
              <p className="text-sm text-muted-foreground">
                {trackedDelivery.deliveryNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryTracker;