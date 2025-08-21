import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import ReservationPage from "./pages/ReservationPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout"; // 👈 Import AdminLayout
import ReservationsDashboard from "./pages/admin/ReservationsDashboard";
import MenuDashboard from "./pages/admin/MenuDashboard"; // 👈 Import MenuDashboard
import { useState } from "react";
import CartSidebar from "./components/CartSidebar";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersDashboard from "./pages/admin/OrdersDashboard";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />{" "}
      {/* 👈 Pass handler to Navbar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />{" "}
      {/* 👈 Add CartSidebar */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="reservations" element={<ReservationsDashboard />} />
            <Route path="orders" element={<OrdersDashboard />} />
            <Route path="menu" element={<MenuDashboard />} />
            {/* Add more nested admin routes here */}
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
