import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Make sure your path is correct
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import CartIcon from "./CartIcon";

const Navbar = ({ onCartClick }) => {
  // --- 1. Get both the Firebase user and your database user profile ---
  const { user, dbUser } = useAuth();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold border-b-2 border-primary pb-1 transition"
      : "text-text-secondary hover:text-primary transition";

  // --- 2. Determine if the user has an admin-level role ---
  const isAdminOrManager =
    dbUser?.role === "admin" || dbUser?.role === "manager";

  const handleLogout = () => {
    signOut(auth);
    toast.success("Logged out successfully");
  };

  return (
    <nav className="bg-background shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-primary hover:text-primary-hover transition"
          >
            Urban Grill
          </Link>

          <div className="space-x-8 flex items-center font-medium">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/reservations" className={navLinkClass}>
              Book a Table
            </NavLink>

            <CartIcon onClick={onCartClick} />

            {/* --- 3. Implement the new conditional logic --- */}
            {user ? (
              <>
                {/* If user is admin/manager, show Admin Dashboard link */}
                {isAdminOrManager ? (
                  <NavLink
                    to="/admin/orders" // Or your main admin route
                    className={({ isActive }) =>
                      isActive
                        ? "text-secondary font-semibold border-b-2 border-secondary pb-1 transition"
                        : "text-secondary hover:text-secondary-hover font-semibold transition"
                    }
                  >
                    Admin Dashboard
                  </NavLink>
                ) : (
                  // Otherwise, show the Customer Dashboard link
                  <NavLink
                    to="/dashboard/my-orders"
                    className={({ isActive }) =>
                      isActive
                        ? "text-secondary font-semibold border-b-2 border-secondary pb-1 transition"
                        : "text-secondary hover:text-secondary-hover font-semibold transition"
                    }
                  >
                    My Dashboard
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-primary text-white py-2 px-5 rounded-lg shadow-md hover:bg-primary-hover transition"
                >
                  Logout
                </button>
              </>
            ) : (
              // If no user is logged in, show the Login link
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-primary text-white py-1.5 px-4 rounded-md shadow-md border-2 border-primary"
                    : "bg-primary text-white py-2 px-5 rounded-md shadow-md hover:bg-primary-hover transition"
                }
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
