import { useState } from 'react';
import { Button } from '@/shared/ui/buttons';
import { API } from '@/shared/api/axiosInstance';

const DeliverySystemTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Backend connectivity
      console.log('Testing backend connectivity...');
      const backendTest = await API.get('/test/delivery-system');
      results.backendConnectivity = {
        success: true,
        data: backendTest.data
      };
    } catch (error) {
      results.backendConnectivity = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 2: Authentication
      console.log('Testing authentication...');
      const authTest = await API.get('/test/auth-test');
      results.authentication = {
        success: true,
        data: authTest.data
      };
    } catch (error) {
      results.authentication = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 3: Delivery endpoints
      console.log('Testing delivery endpoints...');
      const upcomingTest = await API.get('/deliveries/upcoming');
      results.upcomingDeliveries = {
        success: true,
        data: upcomingTest.data
      };
    } catch (error) {
      results.upcomingDeliveries = {
        success: false,
        error: error.message
      };
    }

    try {
      const pastTest = await API.get('/deliveries/past');
      results.pastDeliveries = {
        success: true,
        data: pastTest.data
      };
    } catch (error) {
      results.pastDeliveries = {
        success: false,
        error: error.message
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border">
      <h3 className="text-lg font-semibold mb-4">Delivery System Test</h3>
      
      <Button onClick={runTests} disabled={loading} className="mb-4">
        {loading ? 'Running Tests...' : 'Run System Tests'}
      </Button>

      {testResults && (
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h4 className="font-medium">Backend Connectivity</h4>
            <div className={`text-sm ${testResults.backendConnectivity.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResults.backendConnectivity.success ? '✅ Success' : '❌ Failed'}
            </div>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(testResults.backendConnectivity, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Authentication Test</h4>
            <div className={`text-sm ${testResults.authentication.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResults.authentication.success ? '✅ Success' : '❌ Failed'}
            </div>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(testResults.authentication, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Upcoming Deliveries Endpoint</h4>
            <div className={`text-sm ${testResults.upcomingDeliveries.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResults.upcomingDeliveries.success ? '✅ Success' : '❌ Failed'}
            </div>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(testResults.upcomingDeliveries, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Past Deliveries Endpoint</h4>
            <div className={`text-sm ${testResults.pastDeliveries.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResults.pastDeliveries.success ? '✅ Success' : '❌ Failed'}
            </div>
            <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(testResults.pastDeliveries, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySystemTest;