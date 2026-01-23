import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  quantity?: number;
  onAdd: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  formatPrice: (price: number) => string;
}

export function ProductCard({
  product,
  quantity = 0,
  onAdd,
  onUpdateQuantity,
  formatPrice,
}: ProductCardProps) {
  const isInCart = quantity > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all",
        isInCart
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}/{product.unit}
        </p>
      </div>
      <div className="shrink-0">
        {isInCart ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, -1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(product.id, 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd(product)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>
    </div>
  );
}