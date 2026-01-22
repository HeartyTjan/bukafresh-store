import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Search, Check, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/context/OrdersContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface CartItem {
  product: Product;
  quantity: number;
}

const DashboardShop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const { toast } = useToast();
  const { addOrder } = useOrders();

  const categories = [...new Set(mockProducts.map((p) => p.category))];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getQuantity = (productId: string) => {
    const item = cart.find((c) => c.product.id === productId);
    return item?.quantity || 0;
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((c) => c.product.id === productId);
      if (!item) return prev;

      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        return prev.filter((c) => c.product.id !== productId);
      }
      return prev.map((c) =>
        c.product.id === productId ? { ...c, quantity: newQuantity } : c
      );
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setShowCheckoutDialog(true);
  };

  const confirmOrder = () => {
    // Create order items from cart
    const orderItems = cart.map((item) => ({
      id: `item-${Date.now()}-${item.product.id}`,
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      price: item.product.price,
    }));

    // Add order to context
    addOrder(orderItems, cartTotal, 'addon');

    toast({
      title: "Order Placed!",
      description: `Your add-on order has been submitted. Check WhatsApp for payment details.`,
    });
    setCart([]);
    setShowCheckoutDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Shop Add-ons
            </h1>
            <p className="text-muted-foreground mt-1">
              Order extra groceries outside your subscription
            </p>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="flex items-center gap-4 bg-primary/5 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{cartItemCount} items</p>
                  <p className="text-sm text-primary font-bold">{formatPrice(cartTotal)}</p>
                </div>
              </div>
              <Button variant="hero" size="sm" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);
            const isInCart = quantity > 0;

            return (
              <div
                key={product.id}
                className={cn(
                  "bg-card rounded-xl border p-4 transition-all",
                  isInCart ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                    {product.popular && (
                      <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {formatPrice(product.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{product.unit}
                    </span>
                  </p>
                  <div className="pt-2">
                    {isInCart ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => addToCart(product)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Order Summary</DialogTitle>
            <DialogDescription>
              Review your add-on order before confirming
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-amber-800">Separate Payment</p>
                <p className="text-sm text-amber-700">
                  This is a one-time purchase and does <strong>not</strong> affect your monthly subscription. 
                  You'll pay for these items separately.
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground">Items in your order</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {item.product.name} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-primary">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">How to Pay</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <p>After confirming, you'll receive a WhatsApp message with bank account details</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <p>Transfer the exact amount to the provided account</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <p>Your items will be included in your next delivery once payment is confirmed</p>
                </div>
              </div>
            </div>

            {/* Subscription Notice */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <p>Your regular subscription billing remains unchanged</p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowCheckoutDialog(false)} className="w-full sm:w-auto">
              Continue Shopping
            </Button>
            <Button variant="hero" onClick={confirmOrder} className="w-full sm:w-auto">
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardShop;
