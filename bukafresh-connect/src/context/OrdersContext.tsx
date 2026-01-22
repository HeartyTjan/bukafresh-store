import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order, OrderItem, Address } from '@/types';
import { mockOrders, mockAddresses } from '@/data/mockUser';

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], total: number, type: 'subscription' | 'addon') => void;
  getOrderStats: () => {
    totalOrders: number;
    totalSpent: number;
    deliveredCount: number;
  };
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = useCallback((items: OrderItem[], total: number, type: 'subscription' | 'addon') => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: 'user-1',
      type,
      items,
      subtotal: total,
      deliveryFee: type === 'addon' ? 500 : 0,
      total: type === 'addon' ? total + 500 : total,
      status: 'pending',
      createdAt: new Date(),
      address: mockAddresses[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  const getOrderStats = useCallback(() => {
    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
      deliveredCount: orders.filter((o) => o.status === 'delivered').length,
    };
  }, [orders]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderStats }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
