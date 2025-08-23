import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import CartSidebar from '@/components/CartSidebar';
import useRole from '@/hooks/useRole';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const role = useRole();
  const HandleCardPanelOpen = () => {
    if (role == 'customer') {
      setIsCartOpen(true);
    }
  };
  return (
    <div className="font-fontPrimary bg-background">
      <div className="sticky top-0 z-50">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
      <Outlet context={{ HandleCardPanelOpen }} />
      <Footer />
    </div>
  );
};

export default MainLayout;
