# Subscription API Implementation Guide

## Overview

This document describes the implementation of the `cancelSubscription` API consumer and the complete subscription management system.

## Files Modified

### 1. **subscriptionService.js**

- **Path**: `src/features/subscription/api/subscriptionService.js`
- **Change**: Updated `cancelSubscription` method to accept optional `reason` parameter
- **Method Signature**:
  ```javascript
  cancelSubscription: async(subscriptionId, (reason = null));
  ```
- **Details**:
  - Sends a PUT request to `/subscriptions/{subscriptionId}/cancel`
  - Includes cancellation reason in request payload if provided
  - Handles errors with descriptive messages
  - Returns response data with updated subscription status

### 2. **useSubscription.js (hooks)**

- **Path**: `src/features/subscription/hooks/useSubscription.js`
- **Changes**: Enhanced all subscription hooks with success/error alerts
- **Hooks Updated**:
  1. `useCancelSubscription()` - Cancel subscription with reason
  2. `usePauseSubscription()` - Pause subscription temporarily
  3. `useResumeSubscription()` - Resume paused subscription
  4. `useCreateSubscription()` - Create new subscription
  5. `useActivateSubscription()` - Activate subscription
  6. `useDeleteSubscription()` - Delete subscription

### 3. **CancelSubscriptionModal.jsx**

- **Path**: `src/features/subscription/components/CancelSubscriptionModal.jsx`
- **Current Implementation**:
  - Uses `useCancelSubscription` hook from `hooks/useSubscription.js`
  - Collects cancellation reason from user
  - Provides predefined reason options or custom reason input
  - Displays subscription details before cancellation
  - Shows warnings about cancellation effects
  - Suggests alternatives (pause, change frequency, etc.)

## API Endpoint Details

### Cancel Subscription Endpoint

```
PUT /subscriptions/{subscriptionId}/cancel
Content-Type: application/json

Request Body (optional):
{
  "reason": "Too expensive"
}

Response:
{
  "data": {
    "id": "subscription-id",
    "status": "CANCELED",
    "cancelledAt": "2024-02-03T10:30:00Z",
    ...
  },
  "success": true,
  "message": "Subscription cancelled successfully"
}
```

## Usage Example

### In a React Component

```jsx
import { useCancelSubscription } from "@/features/subscription/hooks/useSubscription";

function MyComponent() {
  const cancelMutation = useCancelSubscription();

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({
        subscriptionId: "sub-123",
        reason: "Too expensive",
      });
      // Success - alert is shown automatically
    } catch (error) {
      // Error - alert is shown automatically
      console.error("Cancellation failed:", error);
    }
  };

  return (
    <button onClick={handleCancel} disabled={cancelMutation.isPending}>
      {cancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
}
```

## Key Features Implemented

### 1. **Reason Tracking**

- Collects cancellation reason from user
- Optional field for improved user experience
- Helps business understand why users cancel

### 2. **Error Handling**

- All hooks include comprehensive error handling
- Custom error messages displayed to users
- Console logging for debugging

### 3. **User Feedback**

- Success alerts with encouraging messages
- Error alerts with actionable error descriptions
- Loading states during API calls
- Query invalidation for cache updates

### 4. **React Query Integration**

- Automatic cache invalidation on success
- Query key constants for consistency
- Retry logic for failed requests
- Stale time and gc time configuration

## Subscription Statuses

| Status   | Description                                 |
| -------- | ------------------------------------------- |
| ACTIVE   | Active subscription with ongoing deliveries |
| PENDING  | Awaiting payment or activation              |
| PAUSED   | Temporarily paused by user                  |
| CANCELED | Cancelled by user                           |
| INACTIVE | Not yet activated                           |

## Authentication

All API requests require authentication via Bearer token stored in localStorage:

```javascript
Authorization: Bearer {authToken}
```

## Testing

### Manual Testing Checklist

- [ ] Can cancel subscription with reason
- [ ] Can cancel subscription without reason
- [ ] Success alert appears after cancellation
- [ ] Error alert appears if cancellation fails
- [ ] Subscription data updates after cancellation
- [ ] Modal closes after successful cancellation
- [ ] Loading state shows while cancelling

### API Requirements

- Backend must accept PUT request to `/subscriptions/{subscriptionId}/cancel`
- Backend should accept optional reason in request body
- Backend should return updated subscription with CANCELED status
- Backend should handle errors gracefully

## Dependencies

- **react-query**: For data fetching and mutations
- **lucide-react**: For UI icons
- **axios**: For HTTP requests (via subscriptionService)

## Notes

- The cancellation reason is optional but recommended for UX
- Cancelled subscriptions can be reactivated according to business rules
- All mutations invalidate cache to ensure fresh data
- Success/error messages are shown automatically via customAlert
