import { ShoppingCart } from 'lucide-react';

interface CartSummaryProps {
  itemCount: number;
  totalQuantity: number;
  total: number;
  formatPrice: (price: number) => string;
}

export function CartSummary({
  itemCount,
  totalQuantity,
  total,
  formatPrice,
}: CartSummaryProps) {
  if (itemCount === 0) return null;

  return (
    <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{itemCount} items</p>
          <p className="text-sm text-muted-foreground">
            {totalQuantity} total units
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
        <p className="text-xs text-muted-foreground">Subtotal</p>
      </div>
    </div>
  );
}