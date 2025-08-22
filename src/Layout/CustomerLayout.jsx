
import CustomerSidebar from '@/pages/customer/CustomerSidebar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <CustomerSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
