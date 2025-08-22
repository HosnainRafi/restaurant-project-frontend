import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import CartIcon from "./CartIcon";

const Navbar = ({ onCartClick }) => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold border-b-2 border-primary pb-1 transition"
      : "text-text-secondary hover:text-primary transition";

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

            {user ? (
              <>
                <NavLink
                  to="/admin/reservations"
                  className={({ isActive }) =>
                    isActive
                      ? "text-secondary font-semibold border-b-2 border-secondary pb-1 transition"
                      : "text-secondary hover:text-secondary-hover font-semibold transition"
                  }
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => signOut(auth)}
                  className="bg-primary text-white py-2 px-5 rounded-lg shadow-md hover:bg-primary-hover transition"
                >
                  Logout
                </button>
              </>
            ) : (
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
