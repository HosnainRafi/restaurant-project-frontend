import MainLayout from "@/Layout/MainLayout";
import CheckoutPage from "@/pages/CheckoutPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MenuPage from "@/pages/MenuPage";
import ReservationPage from "@/pages/ReservationPage";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./../components/ProtectedRoute";
import AdminLayout from "@/Layout/AdminLayout";
import ReservationsDashboard from "@/pages/admin/ReservationsDashboard";
import OrdersDashboard from "@/pages/admin/OrdersDashboard";
import ErrorPage from "@/pages/Error/Error";
import MenuManagement from "@/pages/admin/MenuManagement";
import AddMenuItem from "@/pages/admin/AddMenuItem";
import AddChef from "@/pages/admin/AddChef";
import AddFoodCategory from "@/pages/admin/AddFoodCategory";
import Register from "@/pages/Register";
import ManageUsers from "@/pages/admin/ManageUsers";

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
        path: '/register',
        element: <Register />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <ReservationsDashboard />
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
        path: 'add-menu-item',
        element: (
          <ProtectedRoute>
            <AddMenuItem />
          </ProtectedRoute>
        ),
      },
      {
        path: 'menu-management',
        element: (
          <ProtectedRoute>
            <MenuManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-chef',
        element: (
          <ProtectedRoute>
            <AddChef />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-food-category',
        element: (
          <ProtectedRoute>
            <AddFoodCategory />
          </ProtectedRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
