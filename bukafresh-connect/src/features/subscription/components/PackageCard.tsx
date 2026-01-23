import { Check, ShoppingBasket, Star, Crown } from 'lucide-react';
import { Package } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatPrice } from '../utils/formatters';

const packageIcons: Record<string, typeof ShoppingBasket> = {
  single: ShoppingBasket,
  couple: Star,
  premium: Crown,
};

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  deliveryFrequency: 'weekly' | 'monthly';
  onSelect: (pkg: Package) => void;
}

export function PackageCard({
  pkg,
  isSelected,
  deliveryFrequency,
  onSelect,
}: PackageCardProps) {
  const Icon = packageIcons[pkg.type] || ShoppingBasket;
  const price = deliveryFrequency === 'weekly'
    ? pkg.weeklyDeliveryPrice
    : pkg.monthlyDeliveryPrice;

  return (
    <button
      onClick={() => onSelect(pkg)}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card",
        pkg.popular && "ring-2 ring-accent ring-offset-2"
      )}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
          Most Popular
        </span>
      )}

      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      <h3 className="text-xl font-display font-bold text-foreground">{pkg.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
      <p className="text-xs text-primary mt-1">{pkg.servings}</p>

      <div className="mt-4">
        <span className="text-2xl font-bold text-foreground">{formatPrice(price)}</span>
        <span className="text-muted-foreground">/month</span>
      </div>

      <ul className="mt-4 space-y-2 flex-1">
        {pkg.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={isSelected ? "hero" : "outline"}
        className="w-full mt-6"
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </Button>
    </button>
  );
}