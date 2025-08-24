import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import CartIcon from './CartIcon';
import useRole from '@/hooks/useRole';
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import api from '@/lib/api';
import NotificationBell from './NotificationBell';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ onCartClick }) => {
  const { user, dbUser } = useAuth();
  const role = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [playNotificationSound] = useSound('./sound.wav', {
    volume: 0.5,
  });

  // --- START: THE FIX ---
  const handleNotificationClick = link => {
    // If a link is provided on the notification, navigate to it.
    if (link) {
      navigate(link);
    }
    // Close the panel regardless of whether a link was clicked.
    setIsPanelOpen(false);
  };

  // Calculate the unread count directly from the notifications state.
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Effect for fetching initial notifications when the user logs in.
  useEffect(() => {
    if (user && dbUser?._id) {
      api
        .get('/notifications')
        .then(res => setNotifications(res.data.data || []))
        .catch(err => console.error('Failed to fetch notifications', err));
    }
  }, [user, dbUser]);

  // Effect for managing the real-time socket connection.
  useEffect(() => {
    if (!dbUser?._id) return;

    const socket = io(import.meta.env.VITE_API_URL);
    socket.emit('join_room', dbUser._id);

    const handleNewNotification = newNotification => {
      setNotifications(prev => [newNotification, ...prev]);

      // Sound/vibration logic is now centralized here.
      playNotificationSound();
      if (navigator.vibrate) {
        try {
          navigator.vibrate(200);
        } catch (e) {
          console.log('Vibration not supported or blocked.', e);
        }
      }
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.disconnect();
    };
  }, [dbUser?._id, playNotificationSound]);

  // --- END: CONSOLIDATED LOGIC ---

  // Effect for handling clicks outside the dropdown and scroll events.
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleScroll = () => setScrolled(window.scrollY > 10);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMarkAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setIsPanelOpen(false);
    api.patch('/notifications/mark-as-read').catch(err => {
      console.error('Failed to mark notifications as read', err);
    });
  };

  const handleLogout = () => {
    signOut(auth);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const navLinkClass = ({ isActive }) => {
    const baseColor = scrolled ? 'text-text-secondary' : 'text-sky-500';
    const activeColor = 'text-primary';
    return isActive
      ? `${activeColor} font-semibold border-b-2 border-primary text-lg transition bg-white/5`
      : `${baseColor} hover:text-primary transition text-lg`;
  };

  const linkTextColor = scrolled
    ? 'h-6 w-6 text-text-secondary'
    : 'h-6 w-6 text-sky-500';

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/50 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className={`text-2xl font-extrabold tracking-wide transition ${
              scrolled ? 'text-primary' : 'text-sky-500'
            }`}
          >
            Urban Grill
          </Link>

          <div className="hidden md:flex items-center space-x-6 font-medium">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            {role !== 'admin' && (
              <NavLink
                to="/reservations"
                className={navLinkClass}
                onClick={() => setDropdownOpen(false)}
              >
                Book a Table
              </NavLink>
            )}
            {user && (
              <NotificationBell
                unreadCount={unreadCount}
                onOpen={() => setIsPanelOpen(true)}
                color={linkTextColor}
              />
            )}
            {role === 'customer' && user && (
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

          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <NotificationBell
                unreadCount={unreadCount}
                onOpen={() => setIsPanelOpen(true)}
              />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`text-2xl transition ${linkTextColor}`}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

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
            {role !== 'admin' && (
              <NavLink
                to="/reservations"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Table
              </NavLink>
            )}
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

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default Navbar;
