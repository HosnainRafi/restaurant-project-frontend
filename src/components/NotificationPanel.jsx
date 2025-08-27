// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNotificationClick,
}) => {
  const handlePanelClick = () => {
    onMarkAsRead();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col rounded-l-2xl overflow-hidden"
            onClick={handlePanelClick}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#8B1E3F] to-[#701830] text-white shadow-md sticky top-0 z-10">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <div className="text-6xl mb-3">🔔</div>
                  <p className="text-sm">You have no new notifications.</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <motion.div
                    key={notification._id}
                    onClick={() => onNotificationClick(notification.link)}
                    whileHover={{ scale: 1.02 }}
                    className={`mb-3 p-4 rounded-xl shadow-sm border cursor-pointer transition ${
                      !notification.isRead
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
