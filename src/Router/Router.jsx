import MainLayout from '@/Layout/MainLayout';
import CheckoutPage from '@/pages/CheckoutPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import MenuPage from '@/pages/MenuPage';
import ReservationPage from '@/pages/ReservationPage';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './../components/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';
import ReservationsDashboard from '@/pages/admin/ReservationsDashboard';
import OrdersDashboard from '@/pages/admin/OrdersDashboard';
import MenuDashboard from '@/pages/admin/MenuDashboard';
import ErrorPage from '@/pages/Error/Error';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/menu',
        element: <MenuPage />,
      },
      {
        path: '/reservations',
        element: <ReservationPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reservations',
        element: (
          <ProtectedRoute>
            <ReservationsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrdersDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'menu',
        element: (
          <ProtectedRoute>
            <MenuDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
