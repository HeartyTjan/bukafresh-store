import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8084/api";

// Create axios instance with auth token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem("authToken");
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const paymentService = {
  processPayment: async ({ data, config }) => {
    console.log("Processing payment with data:", data, "and config:", config);
    try {
      const api = createAuthenticatedRequest(); // your Axios instance

      // Merge config with headers to ensure idempotency-key is included
      const requestConfig = {
        ...config,
        headers: {
          ...api.defaults.headers,
          ...(config?.headers || {}),
        },
      };

      const response = await api.post("/payments/process", data, requestConfig);
      console.log("Process payment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Process payment error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to process payment",
      );
    }
  },

  // Get payment by ID (matches backend GET /api/payments/{paymentId})
  getPayment: async (paymentId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Get payment error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment",
      );
    }
  },

  // Get user payments (matches backend GET /api/payments/user)
  getUserPayments: async () => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get("/payments/user");
      return response.data;
    } catch (error) {
      console.error("Get user payments error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user payments",
      );
    }
  },

  // Get subscription payments (matches backend GET /api/payments/subscription/{subscriptionId})
  getSubscriptionPayments: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get(
        `/payments/subscription/${subscriptionId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Get subscription payments error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch subscription payments",
      );
    }
  },
};
