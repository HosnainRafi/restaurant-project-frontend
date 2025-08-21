import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import CartIcon from "./CartIcon"; // 👈 Import CartIcon

const Navbar = ({ onCartClick }) => {
  // 👈 Accept onCartClick prop
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Urban Grill
        </Link>
        <div className="space-x-6 flex items-center">
          {/* Public Links */}
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link to="/menu" className="text-gray-600 hover:text-gray-800">
            Menu
          </Link>
          <Link
            to="/reservations"
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            Book a Table
          </Link>
          <CartIcon onClick={onCartClick} /> {/* 👈 Add CartIcon */}
          {/* Conditional Admin/Login Links */}
          {user ? (
            <>
              <Link
                to="/admin/reservations"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
