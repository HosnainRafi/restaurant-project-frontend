import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const CustomerSidebar = () => {
  const activeLinkClass = 'bg-primary text-white rounded-lg shadow-md';
  const inactiveLinkClass =
    'text-text-secondary hover:bg-primary/10 hover:text-primary rounded-lg';

  return (
    <aside className="w-72 bg-white shadow-xl flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="text-2xl font-bold text-primary">
          Customer Dashboard
        </Link>
      </div>

      {/* Main Nav Links */}
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
          to="/customer/dashboard/reservations"
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
          to="/customer/dashboard/my-orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <FaShoppingCart className="text-lg" />
          My Orders
        </NavLink>
      </nav>

      {/* Profile link above logout */}
      <div className="mt-auto px-2 flex flex-col gap-1">
        <NavLink
          to="/customer/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
              isActive ? activeLinkClass : inactiveLinkClass
            }`
          }
        >
          <FaUser className="text-lg" />
          Profile
        </NavLink>

        {/* Logout */}
        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-black bg-text-secondary/40 hover:bg-text-secondary hover:text-white rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
