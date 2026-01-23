import { Package } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowRight, Calendar, CreditCard } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface PlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Package;
  newPlan: Package;
  deliveryFrequency: 'weekly' | 'monthly';
  nextBillingDate: Date;
  onConfirm: () => void;
}

export function PlanChangeDialog({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  deliveryFrequency,
  nextBillingDate,
  onConfirm,
}: PlanChangeDialogProps) {
  const currentPrice = deliveryFrequency === 'weekly'
    ? currentPlan.weeklyDeliveryPrice
    : currentPlan.monthlyDeliveryPrice;

  const newPrice = deliveryFrequency === 'weekly'
    ? newPlan.weeklyDeliveryPrice
    : newPlan.monthlyDeliveryPrice;

  const priceDifference = newPrice - currentPrice;
  const isUpgrade = priceDifference > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Confirm Plan Change
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              {/* Plan comparison */}
              <div className="flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Current</p>
                  <p className="font-semibold text-foreground">{currentPlan.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(currentPrice)}/mo</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary shrink-0" />
                <div className="text-center flex-1">
                  <p className="text-xs text-muted-foreground mb-1">New Plan</p>
                  <p className="font-semibold text-foreground">{newPlan.name}</p>
                  <p className="text-sm text-primary font-medium">{formatPrice(newPrice)}/mo</p>
                </div>
              </div>

              {/* Price difference */}
              <div className={`p-3 rounded-lg ${isUpgrade ? 'bg-primary/10' : 'bg-green-50'}`}>
                <p className={`text-sm font-medium ${isUpgrade ? 'text-primary' : 'text-green-700'}`}>
                  {isUpgrade
                    ? `+${formatPrice(priceDifference)}/month increase`
                    : `${formatPrice(Math.abs(priceDifference))}/month savings`
                  }
                </p>
              </div>

              {/* Timeline info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Effective Date</p>
                    <p className="text-sm text-muted-foreground">
                      Your new plan starts on {nextBillingDate.toLocaleDateString('en-NG', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">New Payment Setup</p>
                    <p className="text-sm text-muted-foreground">
                      You'll need to set up a new direct debit mandate for the updated amount.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Continue to Payment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}