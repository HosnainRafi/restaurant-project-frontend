import AdminLayout from '@/Layout/AdminLayout';
import ReservationsDashboard from '@/pages/admin/ReservationsDashboard';
import OrdersDashboard from '@/pages/admin/OrdersDashboard';
import MenuManagement from '@/pages/admin/MenuManagement';
import ManageUsers from '@/pages/admin/ManageUsers';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import ErrorPage from '@/pages/Error/Error';
import ManageChefs from '@/pages/admin/ManageChefs';
import ManageFoodCategories from '@/pages/admin/ManageFoodCategories';
import AdminProfile from '@/pages/admin/AdminProfile';
import ReviewManagement from '@/pages/admin/ReviewManagement';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export const AdminRoutes = [
  {
    path: '/admin/dashboard',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'reservations',
        element: (
          <AdminProtectedRoute>
            <ReservationsDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <AdminProtectedRoute>
            <OrdersDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'menu-management',
        element: (
          <AdminProtectedRoute>
            <MenuManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'manage-chefs',
        element: (
          <AdminProtectedRoute>
            <ManageChefs />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'manage-food-categories',
        element: (
          <AdminProtectedRoute>
            <ManageFoodCategories />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <AdminProtectedRoute>
            <ManageUsers />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'review-management',
        element: (
          <AdminProtectedRoute>
            <ReviewManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <AdminProtectedRoute>
            <AdminProfile />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
];
