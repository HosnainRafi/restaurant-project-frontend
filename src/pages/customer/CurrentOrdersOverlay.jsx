// MinimalOrderStatusOverlay.jsx
import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  FaCheck,
  FaBox,
  FaFire,
  FaClipboardCheck,
  FaRegClock,
} from 'react-icons/fa';
import api from '@/lib/api';
import { Link } from 'react-router-dom';

const STEPS = [
  { id: 'pending', label: 'Pending', icon: FaRegClock },
  { id: 'confirmed', label: 'Confirmed', icon: FaCheck },
  { id: 'preparing', label: 'Preparing', icon: FaFire },
  { id: 'ready', label: 'Ready', icon: FaBox },
  { id: 'completed', label: 'Completed', icon: FaClipboardCheck },
];

const statusAnimations = {
  pending: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: { repeat: Infinity, duration: 1.2 },
  },
  confirmed: {
    scale: [1, 1.3, 1],
    transition: { repeat: Infinity, duration: 1 },
  },
  preparing: {
    rotate: [0, 5, -5, 0],
    transition: { repeat: Infinity, duration: 0.8 },
  },
  ready: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 0.6 } },
  completed: {
    scale: [1, 1.5, 1],
    transition: { repeat: Infinity, duration: 1 },
  },
};

const MinimalOrderStatusOverlay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/auth/me/orders');
        const activeOrders = response.data.data.filter(
          order => order.status !== 'cancel' && order.status !== 'completed'
        );
        setOrders(activeOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setExpanded(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || orders.length === 0) return null;

  const currentOrder = orders[0];
  const currentStepIndex = STEPS.findIndex(
    step => step.id === currentOrder.status
  );
  const StepIcon = STEPS[currentStepIndex].icon;

  const firstItem = currentOrder.items[0]?.name;
  const extraItemsCount = currentOrder.items.length - 1;

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-md md:max-w-lg z-50 px-4">
      <div className="bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden">
        {/* Header / Accordion Toggle */}
        <div
          className="flex items-center justify-between px-6 py-2 cursor-pointer bg-gradient-to-r from-[#8B1E3F]/20 to-[#8B1E3F]/10 hover:from-[#8B1E3F]/30 hover:to-[#8B1E3F]/20 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-500 truncate">
              {firstItem}
              {extraItemsCount > 0 && ` +${extraItemsCount} more`}
            </span>
            <span className="font-semibold text-[#8B1E3F] flex items-center space-x-2">
              <motion.span
                animate={statusAnimations[currentOrder.status]}
                className="inline-block"
              >
                <StepIcon className="w-5 h-5" />
              </motion.span>
              <span>{STEPS[currentStepIndex]?.label}</span>
            </span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Expanded content remains unchanged */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 space-y-4"
            >
              {/* Timeline */}
              <div className="relative flex items-center justify-between mb-4">
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                <motion.div
                  className="absolute top-5 left-0 h-1 bg-[#8B1E3F] rounded-full z-0"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                  }}
                  transition={{ ease: 'easeInOut', duration: 0.6 }}
                />

                {STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className="relative z-10 flex flex-col items-center w-12"
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isActive
                            ? 'bg-[#8B1E3F] border-[#8B1E3F] text-white shadow-lg'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                        animate={{ scale: isCurrent ? 1.3 : 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <StepIcon className="w-4 h-4" />
                      </motion.div>
                      <p
                        className={`mt-1 text-[10px] font-medium text-center ${
                          isActive ? 'text-[#8B1E3F]' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Status message */}
              <div className="text-gray-700 text-sm space-y-2">
                <p>
                  Your order is currently{' '}
                  <span className="font-semibold text-[#8B1E3F]">
                    {STEPS[currentStepIndex]?.label}
                  </span>
                  .
                </p>

                {/* Item list */}
                <ul className="text-gray-600 text-sm space-y-1">
                  {currentOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity} × {item.name} ($
                      {(item.price / 100).toFixed(2)})
                    </li>
                  ))}
                </ul>

                {/* View Orders link */}
                <div className="text-right mt-2">
                  <Link
                    to="/customer/dashboard/my-orders"
                    className="text-[#8B1E3F] font-semibold text-sm hover:underline"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MinimalOrderStatusOverlay;
