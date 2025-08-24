import { Link, NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBoxOpen,
} from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const CustomerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const activeLinkClass = 'bg-primary text-white shadow-md rounded-xl';
  const inactiveLinkClass =
    'text-gray-600 hover:bg-primary/10 hover:text-primary rounded-xl transition-all';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg rounded-r-2xl flex flex-col overflow-y-auto transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between md:justify-start">
          <Link
            to="/"
            className="text-2xl font-bold text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <button
            className="md:hidden text-xl text-gray-500 hover:text-gray-700 transition"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 flex flex-col gap-2 px-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="text-lg" />
            Home
          </NavLink>

          <NavLink
            to="/customer/dashboard/reservations"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList className="text-lg" />
            Reservations
          </NavLink>

          <NavLink
            to="/customer/dashboard/my-orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaShoppingCart className="text-lg" />
            My Orders
          </NavLink>
          <NavLink
            to="/customer/dashboard/completed-orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaBoxOpen className="text-lg" />
            Completed Orders
          </NavLink>
        </nav>

        {/* Profile + Logout */}
        <div className="mt-auto px-3 py-4 flex flex-col gap-2 border-t border-gray-200">
          <NavLink
            to="/customer/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUser className="text-lg" />
            Profile
          </NavLink>

          <button
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default CustomerSidebar;
