import { Link, NavLink } from 'react-router-dom';
import {
  FaUtensils,
  FaClipboardList,
  FaShoppingCart,
  FaHome,
  FaSignOutAlt,
  FaPlusCircle,
} from 'react-icons/fa';
import { PiChefHatFill } from 'react-icons/pi';
const AdminSidebar = () => {
  const activeLinkClass = 'bg-primary text-white rounded-lg shadow-md';
  const inactiveLinkClass =
    'text-text-secondary hover:bg-primary/10 hover:text-primary rounded-lg';

  return (
    <aside className="w-64 bg-white shadow-xl flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="text-2xl font-bold text-primary">
          Admin Dashboard
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="mt-6 flex-1 flex flex-col gap-1 px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <FaHome className="text-lg" />
          Home
        </NavLink>

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
          to="/admin/add-menu-item"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <FaPlusCircle className="text-lg" />
          Add Menu Item
        </NavLink>

        <NavLink
          to="/admin/menu-management"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <FaUtensils className="text-lg" />
          Menu Management
        </NavLink>

        {/* New Section: Add New Chef */}
        <NavLink
          to="/admin/add-chef"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <PiChefHatFill className="text-lg" />
          Add New Chef
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
