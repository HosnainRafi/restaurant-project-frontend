import MainLayout from '@/Layout/MainLayout';
import HomePage from '@/pages/HomePage';
import MenuPage from '@/pages/MenuPage';
import ReservationPage from '@/pages/ReservationPage';
import LoginPage from '@/pages/LoginPage';
import Register from '@/pages/Register';
import CheckoutPage from '@/pages/CheckoutPage';
import ErrorPage from '@/pages/Error/Error';
import ProtectedRoute from '@/components/ProtectedRoute';
import AboutUsPage from '@/pages/AboutUsPage';
import ContactPage from '@/pages/ContactPage';

export const MainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/menu', element: <MenuPage /> },
      {
        path: '/reservations',
        element: (
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <Register /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/about-us', element: <AboutUsPage /> },
    ],
  },
];
