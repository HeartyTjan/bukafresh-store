import { useState, useEffect } from 'react';
import { deliveryService } from './deliveryService';
import { showErrorAlert, showSuccessAlert } from '@/shared/customAlert';

export const useDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
  const [pastDeliveries, setPastDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deliveryService.getUserDeliveries();
      if (response.success) {
        setDeliveries(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch deliveries');
      }
    } catch (err) {
      setError(err.message);
      showErrorAlert('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deliveryService.getUpcomingDeliveries();
      if (response.success) {
        setUpcomingDeliveries(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch upcoming deliveries');
      }
    } catch (err) {
      console.error('Error fetching upcoming deliveries:', err);
      setError(err.message);
      // Don't show error alert for empty results, just log it
      if (!err.message.includes('404')) {
        showErrorAlert('Failed to load upcoming deliveries');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPastDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deliveryService.getPastDeliveries();
      if (response.success) {
        setPastDeliveries(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch past deliveries');
      }
    } catch (err) {
      console.error('Error fetching past deliveries:', err);
      setError(err.message);
      // Don't show error alert for empty results, just log it
      if (!err.message.includes('404')) {
        showErrorAlert('Failed to load past deliveries');
      }
    } finally {
      setLoading(false);
    }
  };

  const rescheduleDelivery = async (deliveryId, newDateTime) => {
    setLoading(true);
    try {
      const response = await deliveryService.rescheduleDelivery(deliveryId, newDateTime);
      if (response.success) {
        showSuccessAlert('Delivery rescheduled successfully');
        // Refresh deliveries
        await fetchUpcomingDeliveries();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reschedule delivery');
      }
    } catch (err) {
      showErrorAlert(err.message || 'Failed to reschedule delivery');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelDelivery = async (deliveryId, reason) => {
    setLoading(true);
    try {
      const response = await deliveryService.cancelDelivery(deliveryId, reason);
      if (response.success) {
        showSuccessAlert('Delivery cancelled successfully');
        // Refresh deliveries
        await fetchUpcomingDeliveries();
        await fetchPastDeliveries();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to cancel delivery');
      }
    } catch (err) {
      showErrorAlert(err.message || 'Failed to cancel delivery');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const trackDelivery = async (trackingNumber) => {
    setLoading(true);
    try {
      const response = await deliveryService.trackDelivery(trackingNumber);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to track delivery');
      }
    } catch (err) {
      showErrorAlert(err.message || 'Failed to track delivery');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingDeliveries();
    fetchPastDeliveries();
  }, []);

  return {
    deliveries,
    upcomingDeliveries,
    pastDeliveries,
    loading,
    error,
    fetchAllDeliveries,
    fetchUpcomingDeliveries,
    fetchPastDeliveries,
    rescheduleDelivery,
    cancelDelivery,
    trackDelivery,
  };
};