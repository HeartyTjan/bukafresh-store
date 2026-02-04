import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Clock,
  AlertCircle,
  ArrowLeft,
  Building2,
  Phone,
  User,
  Hash,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useSubscription } from "@/features/subscription/api/useSubscription";
import { usePayment } from "@/features/payment/api/usePayment";
import { useUserProfile } from "@/auth/api/useUserProfile";
import { nigerianBanks } from "@/data/mockProducts";
import { cn } from "@/shared/utils/cn";
import { showErrorAlert } from "@/shared/customAlert";

const DashboardPayment = () => {
  const navigate = useNavigate();

  const { subscription, isLoading } = useSubscription();
  const { processPayment, isProcessingPayment } = usePayment();
  const { data, isLoading: isLoadingProfile } = useUserProfile();

  const profileData = data?.data;

  const isPendingPayment = subscription?.status === "PENDING";
  const isActive = subscription?.status === "ACTIVE";

  const [paymentForm, setPaymentForm] = useState({
    bvn: "",
    accountNumber: "",
    bankCode: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (paymentForm.bvn.length !== 11) {
      errors.bvn = "BVN must be exactly 11 digits";
    }

    if (paymentForm.accountNumber.length !== 10) {
      errors.accountNumber = "Account number must be exactly 10 digits";
    }

    if (!paymentForm.bankCode) {
      errors.bankCode = "Please select your bank";
    }

    if (!paymentForm.phoneNumber && !profileData?.phone) {
      errors.phoneNumber = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePaymentSubmit = async () => {
    if (!profileData?.firstName || !profileData?.lastName) {
      showErrorAlert(
        "Profile Incomplete",
        "Please complete your profile before making payment.",
      );
      navigate("/dashboard/profile");
      return;
    }

    if (!validateForm()) {
      showErrorAlert("Form Error", "Please fix the highlighted errors.");
      return;
    }

    const idempotencyKey = uuidv4();

    try {
      await processPayment({
        data: {
          subscriptionId: subscription.id,
          bvn: paymentForm.bvn,
          bankAccount: {
            accountNumber: paymentForm.accountNumber,
            bankCode: paymentForm.bankCode,
          },
        },
        config: {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      });

      navigate("/dashboard/payment-success", {
        state: { deliveryDay: subscription.deliveryDay || "Saturday" },
      });
    } catch (error) {
      console.error(error);
    }
  };
  // ---------------- LOADING ----------------
  if (isLoading || isLoadingProfile) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    );
  }

  // ---------------- NO SUBSCRIPTION ----------------
  if (!subscription) {
    return (
      <div className="max-w-xl mx-auto bg-card border rounded-xl p-8 text-center space-y-4">
        <AlertCircle className="w-14 h-14 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Subscription Yet</h2>
        <p className="text-muted-foreground">
          Choose a plan to start enjoying Bukafresh deliveries.
        </p>
        <Button onClick={() => navigate("/dashboard/subscription")}>
          View Plans
        </Button>
      </div>
    );
  }

  // ---------------- PENDING PAYMENT ----------------
  if (isPendingPayment) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/subscription")}
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
            <p className="text-muted-foreground">
              Activate your subscription to continue
            </p>
          </div>
        </div>

        {/* Subscription Summary */}
        <div className="bg-card border rounded-xl p-6 grid md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-semibold">{subscription.planDetails?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-bold text-lg">
              {subscription.planDetails?.price}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Activation</p>
            <span className="inline-flex items-center gap-1 font-medium text-blue-600">
              First Payment
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Pay once to activate your monthly subscription
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <span className="inline-flex items-center gap-1 text-amber-700">
              <Clock className="w-4 h-4" /> Pending Payment
            </span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <h2 className="font-semibold text-lg">Bank Account Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>
                <Hash className="inline w-4 h-4 mr-1" /> BVN
              </Label>
              <Input
                value={paymentForm.bvn}
                maxLength={11}
                onChange={(e) =>
                  handleInputChange("bvn", e.target.value.replace(/\D/g, ""))
                }
              />
              {formErrors.bvn && (
                <p className="text-sm text-red-500">{formErrors.bvn}</p>
              )}
            </div>

            <div>
              <Label>
                <CreditCard className="inline w-4 h-4 mr-1" /> Account Number
              </Label>
              <Input
                value={paymentForm.accountNumber}
                maxLength={10}
                onChange={(e) =>
                  handleInputChange(
                    "accountNumber",
                    e.target.value.replace(/\D/g, ""),
                  )
                }
              />
              {formErrors.accountNumber && (
                <p className="text-sm text-red-500">
                  {formErrors.accountNumber}
                </p>
              )}
            </div>

            <div>
              <Label>
                <Building2 className="inline w-4 h-4 mr-1" /> Bank
              </Label>
              <select
                className={cn(
                  "w-full border rounded-md px-3 py-2",
                  formErrors.bankCode && "border-red-500",
                )}
                value={paymentForm.bankCode}
                onChange={(e) => handleInputChange("bankCode", e.target.value)}
              >
                <option value="">Select your bank</option>
                {nigerianBanks.map((bank) => (
                  <option key={bank.name} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
              {formErrors.bankCode && (
                <p className="text-sm text-red-500">{formErrors.bankCode}</p>
              )}
            </div>

            {!profileData?.phone && (
              <div>
                <Label>
                  <Phone className="inline w-4 h-4 mr-1" /> Phone Number
                </Label>
                <Input
                  value={paymentForm.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
                {formErrors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {formErrors.phoneNumber}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Profile Preview */}
          <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm">
              Paying as{" "}
              <span className="font-medium">
                {profileData?.firstName} {profileData?.lastName}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handlePaymentSubmit}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing…" : "Pay Now"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/subscription")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE SUBSCRIPTION ----------------
  if (isActive) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Billing Overview</h1>

        <div className="bg-card border rounded-xl p-6 grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-semibold">{subscription.planDetails?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-bold text-lg">
              {subscription.planDetails?.price}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Billing Date</p>
            <p className="font-semibold">
              {subscription.nextBillingDate
                ? new Date(subscription.nextBillingDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DashboardPayment;
