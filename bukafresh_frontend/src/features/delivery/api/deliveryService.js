import { API } from "@shared/api/axiosInstance";

const DELIVERY_BASE_URL = "/deliveries";

export const deliveryService = {
  // Get all deliveries for current user
  getUserDeliveries: async () => {
    const response = await API.get(DELIVERY_BASE_URL);
    return response.data;
  },

  // Get upcoming deliveries
  getUpcomingDeliveries: async () => {
    const response = await API.get(`${DELIVERY_BASE_URL}/upcoming`);
    return response.data;
  },

  // Get past deliveries
  getPastDeliveries: async () => {
    const response = await API.get(`${DELIVERY_BASE_URL}/past`);
    return response.data;
  },

  // Get delivery by ID
  getDeliveryById: async (deliveryId) => {
    const response = await API.get(`${DELIVERY_BASE_URL}/${deliveryId}`);
    return response.data;
  },

  // Track delivery by tracking number
  trackDelivery: async (trackingNumber) => {
    const response = await API.get(
      `${DELIVERY_BASE_URL}/track/${trackingNumber}`,
    );
    return response.data;
  },

  // Reschedule delivery
  rescheduleDelivery: async (deliveryId, newDateTime) => {
    const response = await API.put(
      `${DELIVERY_BASE_URL}/${deliveryId}/reschedule`,
      null,
      { params: { newDateTime } },
    );
    return response.data;
  },

  // Cancel delivery
  cancelDelivery: async (deliveryId, reason) => {
    const response = await API.put(
      `${DELIVERY_BASE_URL}/${deliveryId}/cancel`,
      null,
      { params: { reason } },
    );
    return response.data;
  },
};
