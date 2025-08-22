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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Dynamic nav link class
  const navLinkClass = ({ isActive }) => {
    const baseColor = scrolled ? 'text-text-secondary' : 'text-sky-500';
    const activeColor = scrolled ? 'text-primary' : 'text-primary';
    return isActive
      ? `${activeColor} font-semibold border-b-2 border-primary text-lg transition bg-white/5`
      : `${baseColor} hover:text-primary transition text-lg`;
  };

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

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const linkTextColor = scrolled
    ? 'h-6 w-6 text-text-secondary'
    : 'h-6 w-6 text-sky-500';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/50 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-wide transition ${
            scrolled ? 'text-primary' : 'text-sky-500'
          }`}
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

          {role == 'customer' && user && (
            <CartIcon onClick={onCartClick} color={linkTextColor} />
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={dbUser?.photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-primary hover:scale-105 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl z-50 border border-gray-100">
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
                      <NavLink
                        to="/customer/dashboard/profile"
                        className="block px-5 py-2.5 text-text-secondary hover:bg-primary/10 hover:text-primary transition rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </NavLink>
                    </>
                  )}

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
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="bg-primary text-white py-2 px-4 rounded-md shadow-md hover:bg-primary-hover transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="border border-primary text-primary py-2 px-4 rounded-md shadow-md hover:bg-primary-hover hover:text-white transition"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`text-2xl transition ${linkTextColor}`}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-md px-6 pb-4 space-y-4 border-t border-gray-200">
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
