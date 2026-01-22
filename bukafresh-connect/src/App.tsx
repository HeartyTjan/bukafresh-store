import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import DashboardSubscription from "./pages/DashboardSubscription";
import DashboardDeliveries from "./pages/DashboardDeliveries";
import DashboardOrders from "./pages/DashboardOrders";
import DashboardShop from "./pages/DashboardShop";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardPayment from "./pages/DashboardPayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CheckoutProvider>
        <OrdersProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/subscription"
                element={
                  <ProtectedRoute>
                    <DashboardSubscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/deliveries"
                element={
                  <ProtectedRoute>
                    <DashboardDeliveries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/orders"
                element={
                  <ProtectedRoute>
                    <DashboardOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/shop"
                element={
                  <ProtectedRoute>
                    <DashboardShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <DashboardSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/payment"
                element={
                  <ProtectedRoute>
                    <DashboardPayment />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </OrdersProvider>
      </CheckoutProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
