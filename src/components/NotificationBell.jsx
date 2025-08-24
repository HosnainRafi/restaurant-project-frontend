import { FaBell } from 'react-icons/fa';

// This component now only displays data. All logic is moved to Navbar.
const NotificationBell = ({ unreadCount, onOpen, color }) => {
  return (
    <button
      onClick={onOpen}
      className={`relative ${color} transition-colors`}
    >
      <FaBell size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
