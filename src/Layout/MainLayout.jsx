import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import CartSidebar from '@/components/CartSidebar';
import useRole from '@/hooks/useRole';
import CurrentOrdersOverlay from '@/pages/customer/CurrentOrdersOverlay';
import { useAuth } from '@/hooks/useAuth';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const role = useRole();
  const { user } = useAuth();

  const HandleCardPanelOpen = () => {
    if (role === 'customer') setIsCartOpen(true);
  };

  return (
    <div className="font-fontPrimary bg-background min-h-screen relative">
      <div className="sticky top-0 z-50">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>

      <Outlet context={{ HandleCardPanelOpen }} />

      <Footer />

      {/* Overlay at the bottom */}
      {user && role === 'customer' && <CurrentOrdersOverlay />}
    </div>
  );
};

export default MainLayout;
