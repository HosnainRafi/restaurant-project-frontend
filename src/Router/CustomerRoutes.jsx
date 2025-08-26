import CustomerLayout from '@/Layout/CustomerLayout';
import MyOrdersPage from '@/pages/customer/CustomerOrders';
import CustomerReservations from '@/pages/customer/CustomerReservations';
import CustomerProfile from '@/pages/customer/CustomerProfile';
import OrderDetailPage from '@/pages/customer/OrderDetailPage';
import PaymentPage from '@/pages/PaymentPage';
import CustomerProtectedRoute from '@/components/CustomerProtectedRoute';
import ErrorPage from '@/pages/Error/Error';
import DeliveredOrders from '@/pages/customer/DeliveredOrders';

export const CustomerRoutes = [
  {
    path: '/customer/dashboard',
    element: <CustomerLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <CustomerProtectedRoute>
            <MyOrdersPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <CustomerProtectedRoute>
            <MyOrdersPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'completed-orders',
        element: (
          <CustomerProtectedRoute>
            <DeliveredOrders />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'my-orders/:orderId',
        element: (
          <CustomerProtectedRoute>
            <OrderDetailPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'payment/:orderId',
        element: (
          <CustomerProtectedRoute>
            <PaymentPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'reservations',
        element: (
          <CustomerProtectedRoute>
            <CustomerReservations />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <CustomerProtectedRoute>
            <CustomerProfile />
          </CustomerProtectedRoute>
        ),
      },
    ],
  },
];
