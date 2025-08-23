import MainLayout from "@/Layout/MainLayout";
import CheckoutPage from "@/pages/CheckoutPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MenuPage from "@/pages/MenuPage";
import ReservationPage from "@/pages/ReservationPage";
import { createBrowserRouter, Navigate } from "react-router-dom";
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
import MyOrdersPage from "@/pages/customer/CustomerOrders";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import CustomerLayout from "@/Layout/CustomerLayout";
import CustomerReservations from "@/pages/customer/CustomerReservations";
import CustomerProtectedRoute from "@/components/CustomerProtectedRoute";
import CustomerProfile from "@/pages/customer/CustomerProfile";
import OrderDetailPage from "@/pages/customer/OrderDetailPage";
import PaymentPage from "@/pages/PaymentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/menu",
        element: <MenuPage />,
      },
      {
        path: "/reservations",
        element: <ReservationPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <AdminProtectedRoute>
            <ReservationsDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "reservations",
        element: (
          <AdminProtectedRoute>
            <ReservationsDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <AdminProtectedRoute>
            <OrdersDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "add-menu-item",
        element: (
          <AdminProtectedRoute>
            <AddMenuItem />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "menu-management",
        element: (
          <AdminProtectedRoute>
            <MenuManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "add-chef",
        element: (
          <AdminProtectedRoute>
            <AddChef />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "add-food-category",
        element: (
          <AdminProtectedRoute>
            <AddFoodCategory />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminProtectedRoute>
            <ManageUsers />
          </AdminProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/customer/dashboard",
    element: <CustomerLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <CustomerProtectedRoute>
            <MyOrdersPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <CustomerProtectedRoute>
            <MyOrdersPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: "my-orders/:orderId",
        element: (
          <CustomerProtectedRoute>
            <OrderDetailPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: "payment/:orderId",
        element: (
          <CustomerProtectedRoute>
            <PaymentPage />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: "reservations",
        element: (
          <CustomerProtectedRoute>
            <CustomerReservations />
          </CustomerProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <CustomerProtectedRoute>
            <CustomerProfile />
          </CustomerProtectedRoute>
        ),
      },
    ],
  },
]);
