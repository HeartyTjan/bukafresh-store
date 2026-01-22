import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Building2, 
  User, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCheckout } from '@/context/CheckoutContext';
import { useToast } from '@/hooks/use-toast';
import { nigerianBanks, ActivationType, MandateDetails } from '@/data/nigerianBanks';
import { cn } from '@/lib/utils';

const DashboardPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedPackage, deliveryFrequency, deliveryAddress, resetCheckout } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [mandateCreated, setMandateCreated] = useState(false);
  
  const [formData, setFormData] = useState<MandateDetails>({
    bvn: '',
    accountNumber: '',
    bankCode: '',
    bankName: '',
    activationType: 'transfer',
  });

  const [errors, setErrors] = useState({
    bvn: '',
    accountNumber: '',
    bankCode: '',
  });

  // Redirect if no subscription data
  useEffect(() => {
    if (!selectedPackage || !deliveryAddress) {
      navigate('/checkout');
    }
  }, [selectedPackage, deliveryAddress, navigate]);

  const validateBVN = (bvn: string) => {
    if (bvn.length !== 11) return 'BVN must be 11 digits';
    if (!/^\d+$/.test(bvn)) return 'BVN must contain only numbers';
    return '';
  };

  const validateAccountNumber = (accountNumber: string) => {
    if (accountNumber.length !== 10) return 'Account number must be 10 digits';
    if (!/^\d+$/.test(accountNumber)) return 'Account number must contain only numbers';
    return '';
  };

  const handleBVNChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    setFormData(prev => ({ ...prev, bvn: cleaned }));
    if (cleaned.length === 11) {
      setErrors(prev => ({ ...prev, bvn: validateBVN(cleaned) }));
    } else {
      setErrors(prev => ({ ...prev, bvn: '' }));
    }
  };

  const handleAccountNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, accountNumber: cleaned }));
    if (cleaned.length === 10) {
      setErrors(prev => ({ ...prev, accountNumber: validateAccountNumber(cleaned) }));
    } else {
      setErrors(prev => ({ ...prev, accountNumber: '' }));
    }
  };

  const handleBankChange = (bankCode: string) => {
    const bank = nigerianBanks.find(b => b.code === bankCode);
    setFormData(prev => ({ 
      ...prev, 
      bankCode, 
      bankName: bank?.name || '' 
    }));
    setErrors(prev => ({ ...prev, bankCode: '' }));
  };

  const handleActivationTypeChange = (value: ActivationType) => {
    setFormData(prev => ({ ...prev, activationType: value }));
  };

  const isFormValid = () => {
    return (
      formData.bvn.length === 11 &&
      formData.accountNumber.length === 10 &&
      formData.bankCode !== '' &&
      !errors.bvn &&
      !errors.accountNumber
    );
  };

  const handleCreateMandate = async () => {
    // Validate all fields
    const bvnError = validateBVN(formData.bvn);
    const accountError = validateAccountNumber(formData.accountNumber);
    const bankError = formData.bankCode ? '' : 'Please select a bank';

    setErrors({
      bvn: bvnError,
      accountNumber: accountError,
      bankCode: bankError,
    });

    if (bvnError || accountError || bankError) return;

    setIsLoading(true);

    // Build mandate payload (for backend)
    const mandatePayload = {
      bvn: formData.bvn,
      accountNumber: formData.accountNumber,
      bankCode: formData.bankCode,
      bankName: formData.bankName,
      activationType: formData.activationType,
      // Include subscription details
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.name,
      deliveryFrequency,
      amount: deliveryFrequency === 'weekly' 
        ? selectedPackage?.weeklyDeliveryPrice 
        : selectedPackage?.monthlyDeliveryPrice,
    };

    console.log('Mandate Payload:', mandatePayload);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setMandateCreated(true);

    toast({
      title: "Mandate Setup Initiated",
      description: "You'll receive a confirmation on WhatsApp to complete the authorization.",
    });
  };

  const handleComplete = () => {
    resetCheckout();
    navigate('/dashboard');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (mandateCreated) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">
            Mandate Setup Complete!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your direct debit mandate has been initiated. You'll receive a WhatsApp message 
            with instructions to authorize the mandate from your bank.
          </p>

          <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check your WhatsApp for mandate authorization instructions
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.activationType === 'transfer' 
                    ? 'Complete a one-time transfer to activate your mandate'
                    : 'Your bank will send you an authorization request'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Once authorized, your subscription begins and first delivery is scheduled
                </p>
              </li>
            </ul>
          </div>

          <Button variant="hero" size="lg" onClick={handleComplete}>
            Go to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Set Up Direct Debit
          </h1>
          <p className="text-muted-foreground mt-2">
            Link your bank account for automatic monthly payments
          </p>
        </div>

        {/* Subscription Summary */}
        {selectedPackage && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Subscription</p>
                <p className="font-semibold text-foreground">{selectedPackage.name} Package</p>
                <p className="text-sm text-muted-foreground capitalize">{deliveryFrequency} delivery</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Monthly</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(
                    deliveryFrequency === 'weekly' 
                      ? selectedPackage.weeklyDeliveryPrice 
                      : selectedPackage.monthlyDeliveryPrice
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* BVN */}
          <div className="space-y-2">
            <Label htmlFor="bvn" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Bank Verification Number (BVN)
            </Label>
            <Input
              id="bvn"
              placeholder="Enter your 11-digit BVN"
              value={formData.bvn}
              onChange={(e) => handleBVNChange(e.target.value)}
              className={cn(errors.bvn && "border-destructive")}
            />
            {errors.bvn && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.bvn}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Your BVN is required for mandate verification
            </p>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Select Your Bank
            </Label>
            <Select value={formData.bankCode} onValueChange={handleBankChange}>
              <SelectTrigger className={cn(errors.bankCode && "border-destructive")}>
                <SelectValue placeholder="Choose your bank" />
              </SelectTrigger>
              <SelectContent>
                {nigerianBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.code}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bankCode && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.bankCode}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Account Number
            </Label>
            <Input
              id="accountNumber"
              placeholder="Enter your 10-digit account number"
              value={formData.accountNumber}
              onChange={(e) => handleAccountNumberChange(e.target.value)}
              className={cn(errors.accountNumber && "border-destructive")}
            />
            {errors.accountNumber && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.accountNumber}
              </p>
            )}
          </div>

          {/* Activation Type */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Activation Method
            </Label>
            <RadioGroup
              value={formData.activationType}
              onValueChange={(value) => handleActivationTypeChange(value as ActivationType)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <label
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                  formData.activationType === 'transfer'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="transfer" className="mt-1" />
                <div>
                  <p className="font-medium text-foreground">Transfer</p>
                  <p className="text-sm text-muted-foreground">
                    Make a small transfer to activate the mandate
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                  formData.activationType === 'live_check'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="live_check" className="mt-1" />
                <div>
                  <p className="font-medium text-foreground">Live Check</p>
                  <p className="text-sm text-muted-foreground">
                    Instant verification via your bank app
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Security Notice */}
          <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Bank-Level Security</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your information is encrypted and securely transmitted. We never store your full BVN. 
                The mandate will only debit the agreed subscription amount monthly.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleCreateMandate}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting up mandate...
              </>
            ) : (
              'Create Direct Debit Mandate'
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPayment;
