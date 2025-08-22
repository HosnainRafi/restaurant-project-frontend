import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import CartIcon from './CartIcon';
import useRole from '@/hooks/useRole';
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ onCartClick }) => {
  const { user, dbUser } = useAuth();
  const role = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-semibold border-b-2 border-primary pb-1 transition'
      : 'text-text-secondary hover:text-primary transition';

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-background shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-primary hover:text-primary-hover transition"
        >
          Urban Grill
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium relative">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>

          <CartIcon onClick={onCartClick} />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Image */}
              <img
                src={dbUser?.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
                  {role === 'admin' || role === 'manager' ? (
                    <NavLink
                      to="/admin/dashboard/orders"
                      className="block px-5 py-2.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </NavLink>
                  ) : (
                    <>
                      <NavLink
                        to="/customer/dashboard/my-orders"
                        className="block px-5 py-2.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Dashboard
                      </NavLink>
                      <NavLink
                        to="/reservations"
                        className="block px-5 py-2.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Book a Table
                      </NavLink>
                    </>
                  )}

                  <NavLink
                    to="/customer/dashboard/profile"
                    className="block px-5 py-2.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition rounded-md"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-primary hover:bg-primary/10 transition rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? 'bg-primary text-white py-1.5 px-4 rounded-md shadow-md border-2 border-primary'
                  : 'bg-primary text-white py-2 px-5 rounded-md shadow-md hover:bg-primary-hover transition'
              }
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary text-2xl"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background px-6 pb-4 space-y-4 border-t border-gray-200">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={navLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu
          </NavLink>

          {user ? (
            <div className="space-y-2">
              {role === 'admin' || role === 'manager' ? (
                <NavLink
                  to="/admin/dashboard/orders"
                  className={navLinkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/customer/orders"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </NavLink>
                  <NavLink
                    to="/reservations"
                    className={navLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book a Table
                  </NavLink>
                </>
              )}
              <NavLink
                to="/customer/profile"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-primary text-white py-2 px-4 rounded-md w-full hover:bg-primary-hover transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={navLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
