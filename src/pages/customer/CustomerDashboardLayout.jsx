import { NavLink, Outlet } from "react-router-dom";
import { ListOrdered, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CustomerDashboardLayout = () => {
  const { dbUser } = useAuth();

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-4 md:p-8">
      {/* Sidebar Navigation */}
      <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-bold mb-2">Welcome,</h2>
        <p className="text-gray-600 mb-6 truncate">{dbUser?.email}</p>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard/my-orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive ? "bg-primary text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <ListOrdered size={20} />
            <span>My Orders</span>
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive ? "bg-primary text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <UserCircle size={20} />
            <span>My Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="md:col-span-3">
        <Outlet /> {/* This will render the nested route component */}
      </main>
    </div>
  );
};

export default CustomerDashboardLayout;
