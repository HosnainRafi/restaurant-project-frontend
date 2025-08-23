import AdminLayout from '@/Layout/AdminLayout';
import ReservationsDashboard from '@/pages/admin/ReservationsDashboard';
import OrdersDashboard from '@/pages/admin/OrdersDashboard';
import MenuManagement from '@/pages/admin/MenuManagement';
import AddMenuItem from '@/pages/admin/AddMenuItem';
import AddChef from '@/pages/admin/AddChef';
import AddFoodCategory from '@/pages/admin/AddFoodCategory';
import ManageUsers from '@/pages/admin/ManageUsers';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import ErrorPage from '@/pages/Error/Error';

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
            <ReservationsDashboard />
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
        path: 'add-menu-item',
        element: (
          <AdminProtectedRoute>
            <AddMenuItem />
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
        path: 'add-chef',
        element: (
          <AdminProtectedRoute>
            <AddChef />
          </AdminProtectedRoute>
        ),
      },
      {
        path: 'add-food-category',
        element: (
          <AdminProtectedRoute>
            <AddFoodCategory />
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
    ],
  },
];
