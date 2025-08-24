import { useState } from 'react';
import CustomerSidebar from '@/pages/customer/CustomerSidebar';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const CustomerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-white shadow-sm px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-primary hover:text-primary/80 transition"
          >
            <FaBars />
          </button>
          <span className="font-semibold text-primary text-lg">
            Customer Dashboard
          </span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
