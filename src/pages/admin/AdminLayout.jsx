import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const activeLinkClass = "bg-blue-600 text-white";
  const inactiveLinkClass = "text-gray-700 hover:bg-gray-200";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/admin/reservations"
            className={({ isActive }) =>
              `${
                isActive ? activeLinkClass : inactiveLinkClass
              } block py-2.5 px-6 transition duration-200`
            }
          >
            Reservations
          </NavLink>
          <NavLink
            to="/admin/orders" // 👈 Add this link
            className={({ isActive }) =>
              `${
                isActive ? activeLinkClass : inactiveLinkClass
              } block py-2.5 px-6 transition duration-200`
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `${
                isActive ? activeLinkClass : inactiveLinkClass
              } block py-2.5 px-6 transition duration-200`
            }
          >
            Menu Management
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
