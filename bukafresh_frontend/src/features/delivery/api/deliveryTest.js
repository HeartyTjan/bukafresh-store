// Test file for delivery API endpoints
// This can be used to test the delivery system manually

import { deliveryService } from './deliveryService';

export const testDeliverySystem = async () => {
  console.log('Testing Delivery System...');
  
  try {
    // Test 1: Get upcoming deliveries
    console.log('1. Testing upcoming deliveries...');
    const upcomingResponse = await deliveryService.getUpcomingDeliveries();
    console.log('Upcoming deliveries:', upcomingResponse);
    
    // Test 2: Get past deliveries
    console.log('2. Testing past deliveries...');
    const pastResponse = await deliveryService.getPastDeliveries();
    console.log('Past deliveries:', pastResponse);
    
    // Test 3: Get all deliveries
    console.log('3. Testing all deliveries...');
    const allResponse = await deliveryService.getUserDeliveries();
    console.log('All deliveries:', allResponse);
    
    // Test 4: Track delivery (if we have a tracking number)
    if (upcomingResponse.data && upcomingResponse.data.length > 0) {
      const trackingNumber = upcomingResponse.data[0].trackingNumber;
      if (trackingNumber) {
        console.log('4. Testing delivery tracking...');
        const trackResponse = await deliveryService.trackDelivery(trackingNumber);
        console.log('Tracked delivery:', trackResponse);
      }
    }
    
    console.log('✅ All delivery tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Delivery test failed:', error);
    return false;
  }
};

// Test individual endpoints
export const testEndpoints = {
  upcoming: () => deliveryService.getUpcomingDeliveries(),
  past: () => deliveryService.getPastDeliveries(),
  all: () => deliveryService.getUserDeliveries(),
  track: (trackingNumber) => deliveryService.trackDelivery(trackingNumber),
  reschedule: (deliveryId, newDateTime) => deliveryService.rescheduleDelivery(deliveryId, newDateTime),
  cancel: (deliveryId, reason) => deliveryService.cancelDelivery(deliveryId, reason),
};

// Usage example:
// import { testDeliverySystem, testEndpoints } from './deliveryTest';
// testDeliverySystem();
// or
// testEndpoints.upcoming().then(console.log);