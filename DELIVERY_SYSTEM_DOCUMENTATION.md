# BukaFresh Delivery System Documentation

## Overview

The BukaFresh delivery system automatically creates deliveries when payments are successful and provides comprehensive tracking and management capabilities for both customers and administrators.

## System Architecture

### Backend Components

#### 1. Models
- **Delivery.java**: Core delivery entity with status tracking, address, items, and driver information
- **DeliveryItem**: Nested class for individual items in a delivery

#### 2. Services
- **DeliveryService**: Interface defining delivery operations
- **DeliveryServiceImpl**: Implementation with business logic for delivery management

#### 3. Controllers
- **DeliveryController**: Customer-facing API endpoints
- **AdminDeliveryController**: Admin endpoints for delivery management

#### 4. Repository
- **DeliveryRepository**: MongoDB repository with custom queries for delivery operations

### Frontend Components

#### 1. API Layer
- **deliveryService.js**: HTTP client for delivery API calls
- **useDelivery.jsx**: React hook for delivery state management
- **deliveryTest.js**: Testing utilities for API endpoints

#### 2. UI Components
- **DashboardDelivery.jsx**: Main delivery dashboard with tabs
- **DeliveryTracker.jsx**: Standalone delivery tracking component

## Delivery Flow

### 1. Automatic Delivery Creation
When a payment is successful (webhook received):
1. PaymentServiceImpl triggers delivery creation
2. DeliveryServiceImpl.createDeliveryFromPayment() is called
3. Delivery items are generated based on subscription tier
4. Delivery is scheduled based on subscription settings
5. Tracking number is generated

### 2. Delivery Status Lifecycle
- **SCHEDULED**: Initial status when delivery is created
- **PREPARING**: Order is being prepared for delivery
- **OUT_FOR_DELIVERY**: Driver assigned and delivery in progress
- **DELIVERED**: Successfully delivered to customer
- **CANCELLED**: Cancelled by customer or system
- **FAILED**: Delivery attempt failed

### 3. Customer Operations
- View upcoming and past deliveries
- Track deliveries by tracking number
- Reschedule scheduled deliveries
- Cancel scheduled deliveries
- Contact support

### 4. Admin Operations
- Assign drivers to deliveries
- Update delivery status
- Mark deliveries as delivered or failed

## API Endpoints

### Customer Endpoints (`/api/deliveries`)
- `GET /` - Get all user deliveries
- `GET /upcoming` - Get upcoming deliveries
- `GET /past` - Get past deliveries
- `GET /{deliveryId}` - Get specific delivery
- `GET /track/{trackingNumber}` - Track delivery
- `PUT /{deliveryId}/reschedule` - Reschedule delivery
- `PUT /{deliveryId}/cancel` - Cancel delivery

### Admin Endpoints (`/api/admin/deliveries`)
- `GET /active` - Get all active deliveries
- `PUT /{deliveryId}/assign-driver` - Assign driver
- `PUT /{deliveryId}/mark-delivered` - Mark as delivered
- `PUT /{deliveryId}/mark-failed` - Mark as failed
- `PUT /{deliveryId}/status` - Update status with notes

## Frontend Features

### Dashboard Delivery Component
- **Tab Navigation**: Switch between "My Deliveries" and "Track Delivery"
- **Upcoming Deliveries**: Expandable cards showing delivery details
- **Past Deliveries**: Compact list of completed deliveries
- **Real-time Status**: Color-coded status indicators
- **Actions**: Reschedule, cancel, contact support

### Delivery Tracker Component
- **Tracking Search**: Enter tracking number to get delivery details
- **Status Display**: Visual status with descriptions
- **Delivery Details**: Address, items, driver information
- **Progress Tracking**: Clear status progression

## Subscription Tier Items

### Essentials Tier
- Premium Rice (2kg) - ₦5,000
- Brown Beans (1kg) - ₦2,500
- Fresh Tomatoes (2kg) - ₦1,600

### Standard Tier
- Fresh Chicken (2kg) - ₦7,000
- Premium Rice (3kg) - ₦7,500
- Mixed Vegetables (1 bundle) - ₦3,000
- Fresh Fish (1kg) - ₦4,500

### Premium Tier
- Premium Beef (2kg) - ₦12,000
- Organic Chicken (2kg) - ₦8,000
- Fresh Seafood Mix (1kg) - ₦15,000
- Basmati Rice (5kg) - ₦12,500
- Organic Vegetable Bundle (2 bundles) - ₦8,000

## Error Handling

### Backend
- Custom exceptions for business logic violations
- Global exception handler for consistent error responses
- Validation for delivery state transitions

### Frontend
- Loading states during API calls
- Error alerts for failed operations
- Retry mechanisms for network failures
- Form validation for user inputs

## Security Considerations

### Authentication
- All customer endpoints require valid JWT token
- Admin endpoints require elevated permissions (to be implemented)

### Authorization
- Users can only access their own deliveries
- Delivery operations validated against user ownership

### Data Validation
- Input sanitization for all user-provided data
- Status transition validation
- Date/time validation for rescheduling

## Testing

### Backend Testing
- Unit tests for service layer logic
- Integration tests for repository operations
- API endpoint testing with MockMvc

### Frontend Testing
- Component testing with React Testing Library
- API integration testing with mock services
- User interaction testing

## Deployment Considerations

### Database Indexes
- Index on userId for fast user delivery queries
- Index on trackingNumber for tracking operations
- Index on scheduledDate for date-based queries
- Index on status for status-based filtering

### Performance Optimization
- Pagination for large delivery lists
- Caching for frequently accessed data
- Lazy loading for delivery details

### Monitoring
- Delivery status change logging
- Performance metrics for API endpoints
- Error tracking and alerting

## Future Enhancements

### Planned Features
1. **Real-time Tracking**: GPS tracking integration
2. **Push Notifications**: Status update notifications
3. **Delivery Windows**: Time slot selection
4. **Delivery Instructions**: Special delivery notes
5. **Photo Confirmation**: Delivery proof photos
6. **Rating System**: Delivery experience ratings
7. **Delivery Analytics**: Performance dashboards

### Integration Opportunities
1. **SMS Notifications**: Twilio integration for status updates
2. **Email Notifications**: Delivery confirmations and updates
3. **Maps Integration**: Route optimization and tracking
4. **Payment Integration**: COD and tip handling
5. **Inventory Management**: Real-time stock updates

## Troubleshooting

### Common Issues
1. **Delivery Not Created**: Check payment webhook processing
2. **Status Not Updating**: Verify admin permissions and API calls
3. **Tracking Not Working**: Ensure tracking number format is correct
4. **Frontend Errors**: Check API connectivity and authentication

### Debug Steps
1. Check application logs for error messages
2. Verify database connectivity and data integrity
3. Test API endpoints with Postman or similar tools
4. Review network requests in browser developer tools

## Support

For technical support or questions about the delivery system:
- Check the application logs for detailed error information
- Review API documentation for endpoint specifications
- Contact the development team for system-level issues