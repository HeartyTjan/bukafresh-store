import { useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { PackageSelection } from '@/components/checkout/PackageSelection';
import { DeliverySetup } from '@/components/checkout/DeliverySetup';
import { AccountSetup } from '@/components/checkout/AccountSetup';
import { mockPackages } from '@/data/mockProducts';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Package' },
  { number: 2, label: 'Delivery' },
  { number: 3, label: 'Account' },
];

const Checkout = () => {
  const { step, setStep, selectedPackage, selectPackage, deliveryAddress, prevStep, nextStep } = useCheckout();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-select package from URL parameter
  useEffect(() => {
    const packageParam = searchParams.get('package');
    if (packageParam && !selectedPackage) {
      const matchedPackage = mockPackages.find(
        (pkg) => pkg.name.toLowerCase() === packageParam.toLowerCase()
      );
      if (matchedPackage) {
        selectPackage(matchedPackage);
      }
    }
  }, [searchParams, selectedPackage, selectPackage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // After account creation, redirect to dashboard payment
  useEffect(() => {
    if (step === 3 && isAuthenticated && selectedPackage && deliveryAddress) {
      navigate('/dashboard/payment');
    }
  }, [step, isAuthenticated, selectedPackage, deliveryAddress, navigate]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedPackage;
      case 2:
        return !!deliveryAddress;
      case 3:
        return isAuthenticated;
      default:
        return false;
    }
  };

  const handleNext = () => {
    nextStep();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PackageSelection />;
      case 2:
        return <DeliverySetup />;
      case 3:
        return <AccountSetup />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                Buka<span className="text-primary">Fresh</span>
              </span>
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Cancel
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <button
                  onClick={() => s.number < step && setStep(s.number)}
                  disabled={s.number > step}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-all",
                    s.number <= step ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm",
                    s.number < step
                      ? "bg-primary text-primary-foreground"
                      : s.number === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {s.number < step ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    s.number <= step ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-12 sm:w-20 h-1 mx-2 rounded-full",
                    s.number < step ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {step !== 3 && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
