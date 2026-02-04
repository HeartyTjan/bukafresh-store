import { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useCancelSubscription } from "../hooks/useSubscription";
// import { showSuccessAlert } from "@/shared/customAlert";

const CancelSubscriptionModal = ({ isOpen, onClose, subscription }) => {
  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const cancelMutation = useCancelSubscription();

  const cancellationReasons = [
    "Too expensive",
    "Don't need it anymore",
    "Poor service quality",
    "Moving to a different area",
    "Trying a different service",
    "Temporary financial constraints",
    "Too much food waste",
    "Other",
  ];

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setShowReasonInput(false);
    }
  }, [isOpen]);

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({
        subscriptionId: subscription?.id,
        // reason: reason || "No reason provided",
      });

      // if (onSuccess) {
      //   ShowSuccessAlert("Subscription Cancelled", "");
      // }
      onClose();
    } catch (error) {
      console.error("Cancel subscription error:", error);
    }
  };

  const handleReasonSelect = (selectedReason) => {
    if (selectedReason === "Other") {
      setShowReasonInput(true);
      setReason("");
    } else {
      setReason(selectedReason);
      setShowReasonInput(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateRemainingDays = () => {
    if (!subscription?.currentPeriodEnd) return null;
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Cancel Subscription
              </h2>
              <p className="text-sm text-gray-500">We're sorry to see you go</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={cancelMutation.isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">
                  Before you cancel
                </h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  {remainingDays !== null && (
                    <li>
                      • You have <strong>{remainingDays} days</strong> remaining
                      in your current billing period
                    </li>
                  )}
                  <li>
                    • You'll receive deliveries until{" "}
                    <strong>
                      {formatDate(subscription?.currentPeriodEnd)}
                    </strong>
                  </li>
                  <li>• You can restart your subscription anytime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <h4 className="font-medium text-gray-900 mb-2">
                Current Subscription
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Plan</p>
                  <p className="font-medium">
                    {subscription.planName || subscription.tier || "Standard"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Price</p>
                  <p className="font-medium">
                    {subscription.price || "₦140,000/month"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Next Delivery</p>
                  <p className="font-medium">
                    {formatDate(subscription.nextDelivery)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Status</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {subscription.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why are you cancelling?{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>

            <div className="grid grid-cols-2 gap-2 mb-2">
              {cancellationReasons.map((reasonOption) => (
                <button
                  key={reasonOption}
                  onClick={() => handleReasonSelect(reasonOption)}
                  className={`text-left p-2 rounded border text-sm transition-colors ${
                    reason === reasonOption
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                  disabled={cancelMutation.isPending}
                >
                  {reasonOption}
                </button>
              ))}
            </div>

            {/* Custom reason input */}
            {showReasonInput && (
              <div className="mt-2">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value.slice(0, 200))}
                  placeholder="Please tell us more..."
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  rows={2}
                  disabled={cancelMutation.isPending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your feedback helps us improve
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={cancelMutation.isPending}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex-1"
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Subscription"
              )}
            </Button>
          </div>
          {/* <p className="text-xs text-center text-gray-500 mt-2">
            You can restart your subscription anytime from your dashboard
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
