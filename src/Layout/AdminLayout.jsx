import { NavLink, Outlet } from 'react-router-dom';
import { FaUtensils, FaClipboardList, FaShoppingCart } from 'react-icons/fa';

const AdminLayout = () => {
  const activeLinkClass = 'bg-primary text-white rounded-lg shadow-md';
  const inactiveLinkClass =
    'text-text-secondary hover:bg-primary/10 hover:text-primary rounded-lg';

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
        </div>
        <nav className="mt-6 flex-1 flex flex-col gap-1 px-2">
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <FaClipboardList className="text-lg" />
            Reservations
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <FaShoppingCart className="text-lg" />
            Orders
          </NavLink>

          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <FaUtensils className="text-lg" />
            Menu Management
          </NavLink>
        </nav>
        <div className="p-6 border-t border-gray-200">
          <p className="text-xs text-text-secondary">© 2025 Vibe Admin</p>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
