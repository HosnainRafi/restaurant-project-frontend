import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNotificationClick,
}) => {
  const handlePanelClick = () => {
    onMarkAsRead();
    // You could also add a small delay before closing the panel
    // setTimeout(onClose, 200);
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
            className="fixed inset-0 bg-black/30 z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
            onClick={handlePanelClick}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-gray-500">
                  You have no new notifications.
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => onNotificationClick(notification.link)} // Call the handler on click
                    className={`p-4 border-b flex items-start space-x-3 cursor-pointer ${
                      // Add cursor-pointer
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
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
