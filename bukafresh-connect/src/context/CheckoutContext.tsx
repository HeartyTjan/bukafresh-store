import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Package, Address, OrderItem, CheckoutState } from '@/types';

interface CheckoutContextType extends CheckoutState {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectPackage: (pkg: Package) => void;
  setDeliveryFrequency: (frequency: 'weekly' | 'monthly') => void;
  setDeliveryAddress: (address: Address) => void;
  addAddOn: (item: OrderItem) => void;
  removeAddOn: (itemId: string) => void;
  updateAddOnQuantity: (itemId: string, quantity: number) => void;
  getMonthlyTotal: () => number;
  getAddOnsTotal: () => number;
  resetCheckout: () => void;
}

const initialState: CheckoutState = {
  step: 1,
  selectedPackage: null,
  deliveryFrequency: 'weekly',
  deliveryAddress: null,
  deliveryDay: 'saturday', // Fixed to Saturday
  addOns: [],
};

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(initialState);

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const selectPackage = useCallback((pkg: Package) => {
    setState((prev) => ({ ...prev, selectedPackage: pkg }));
  }, []);

  const setDeliveryFrequency = useCallback((frequency: 'weekly' | 'monthly') => {
    setState((prev) => ({ ...prev, deliveryFrequency: frequency }));
  }, []);

  const setDeliveryAddress = useCallback((address: Address) => {
    setState((prev) => ({ ...prev, deliveryAddress: address }));
  }, []);


  const addAddOn = useCallback((item: OrderItem) => {
    setState((prev) => {
      const existing = prev.addOns.find((a) => a.productId === item.productId);
      if (existing) {
        return {
          ...prev,
          addOns: prev.addOns.map((a) =>
            a.productId === item.productId
              ? { ...a, quantity: a.quantity + item.quantity }
              : a
          ),
        };
      }
      return { ...prev, addOns: [...prev.addOns, item] };
    });
  }, []);

  const removeAddOn = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((a) => a.id !== itemId),
    }));
  }, []);

  const updateAddOnQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setState((prev) => ({
        ...prev,
        addOns: prev.addOns.filter((a) => a.id !== itemId),
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      addOns: prev.addOns.map((a) => (a.id === itemId ? { ...a, quantity } : a)),
    }));
  }, []);


  // Get monthly subscription price based on delivery frequency
  const getMonthlyTotal = useCallback(() => {
    if (!state.selectedPackage) return 0;
    return state.deliveryFrequency === 'weekly'
      ? state.selectedPackage.weeklyDeliveryPrice
      : state.selectedPackage.monthlyDeliveryPrice;
  }, [state.selectedPackage, state.deliveryFrequency]);

  // Get add-ons total (paid separately)
  const getAddOnsTotal = useCallback(() => {
    return state.addOns.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.addOns]);

  const resetCheckout = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setStep,
        nextStep,
        prevStep,
        selectPackage,
        setDeliveryFrequency,
        setDeliveryAddress,
        addAddOn,
        removeAddOn,
        updateAddOnQuantity,
        getMonthlyTotal,
        getAddOnsTotal,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
