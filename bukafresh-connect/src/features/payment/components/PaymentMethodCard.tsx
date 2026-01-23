import { CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentMethodCardProps {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
  onSetDefault?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PaymentMethodCard({
  id,
  bankName,
  accountNumber,
  accountName,
  isDefault = false,
  onSetDefault,
  onDelete,
}: PaymentMethodCardProps) {
  const maskedAccount = `****${accountNumber.slice(-4)}`;

  return (
    <div className={cn(
      "border rounded-xl p-4 bg-card",
      isDefault ? "border-primary" : "border-border"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            isDefault ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{bankName}</span>
              {isDefault && (
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{maskedAccount}</p>
            <p className="text-xs text-muted-foreground">{accountName}</p>
          </div>
        </div>

        {onDelete && !isDefault && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {onSetDefault && !isDefault && (
        <div className="mt-3 pt-3 border-t border-border">
          <button
            onClick={() => onSetDefault(id)}
            className="text-sm text-primary font-medium hover:underline"
          >
            Set as Default
          </button>
        </div>
      )}
    </div>
  );
}