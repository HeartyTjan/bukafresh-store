import {
  CheckCircle,
  MessageSquare,
  CreditCard,
  Package,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";

const MandateInfo = ({ onGoToDashboard, deliveryDay = "Saturday" }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-center mb-3">
          Mandate Setup Complete!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          Your direct debit mandate has been initiated. Check WhatsApp for
          authorization instructions.
        </p>

        {/* Next Steps Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            What happens next?
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Check WhatsApp</p>
                <p className="text-sm text-gray-600">
                  Authorization instructions sent to your WhatsApp
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Complete First Payment
                </p>
                <p className="text-sm text-gray-600">
                  Activate mandate with your first subscription payment
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Subscription Starts
                </p>
                <p className="text-sm text-gray-600">
                  First delivery scheduled for {deliveryDay}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button onClick={onGoToDashboard} className="w-full mb-4">
          Go to Dashboard
        </Button>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Questions? Contact support at{" "}
            <a
              href="mailto:support@bukafresh.com"
              className="text-blue-600 hover:underline"
            >
              support@bukafresh.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MandateInfo;
