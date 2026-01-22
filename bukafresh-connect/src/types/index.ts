// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Subscription Types
export type PackageType = 'single' | 'couple' | 'family' | 'premium';

export interface Package {
  id: string;
  name: string;
  type: PackageType;
  description: string;
  weeklyDeliveryPrice: number;  // Price when user wants weekly delivery (higher)
  monthlyDeliveryPrice: number; // Price when user wants monthly delivery (lower)
  servings: string;
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  package: Package;
  status: 'active' | 'paused' | 'cancelled';
  startDate: Date;
  nextDeliveryDate: Date;
  deliveryDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  pausedUntil?: Date;
  deliveryFrequency: 'weekly' | 'monthly';
}

// Delivery Types
export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  instructions?: string;
}

export interface Delivery {
  id: string;
  subscriptionId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  address: Address;
  items: OrderItem[];
  trackingInfo?: {
    driverName: string;
    estimatedArrival: Date;
    currentLocation?: string;
  };
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  type: 'subscription' | 'addon';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveredAt?: Date;
  address: Address;
}

// Product Types
export type ProductCategory = 'proteins' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'spices' | 'beverages';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
  popular?: boolean;
}

// Bank Details Type
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// Checkout Types
export interface CheckoutState {
  step: number;
  selectedPackage: Package | null;
  deliveryFrequency: 'weekly' | 'monthly';
  deliveryAddress: Address | null;
  deliveryDay: string;
  addOns: OrderItem[];
}
