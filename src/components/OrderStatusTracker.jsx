// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FaCheck,
  FaBox,
  FaFire,
  FaClipboardCheck,
  FaRegClock,
} from 'react-icons/fa';

const STEPS = [
  {
    id: 'pending',
    label: 'Pending',
    icon: FaRegClock,
    color: 'text-yellow-500',
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    icon: FaCheck,
    color: 'text-blue-500',
  },
  {
    id: 'preparing',
    label: 'Preparing',
    icon: FaFire,
    color: 'text-orange-500',
  },
  { id: 'ready', label: 'Ready', icon: FaBox, color: 'text-purple-500' },
  {
    id: 'completed',
    label: 'Completed',
    icon: FaClipboardCheck,
    color: 'text-green-500',
  },
];

const OrderStatusTracker = ({ currentStatus }) => {
  const currentStepIndex = STEPS.findIndex(step => step.id === currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-xl text-center font-semibold shadow-md">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-10 text-center text-gray-800">
        Track Your Order
      </h3>

      {/* Horizontal timeline */}
      <div className="relative flex items-center justify-between">
        {/* Full gray line */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full z-0"></div>

        {/* Active progress line */}
        <motion.div
          className="absolute top-6 left-0 h-1 bg-primary rounded-full z-0"
          initial={{ width: 0 }}
          animate={{
            width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
          }}
          transition={{ ease: 'easeInOut', duration: 0.8 }}
        />

        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center text-center w-20"
            >
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-transform duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-primary border-primary text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <StepIcon className="w-4 h-4 md:w-5 md:h-5" />
              </motion.div>

              <p
                className={`mt-2 md:mt-3 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div className="mt-8 text-center text-gray-700 text-base md:text-lg">
        {currentStatus !== 'completed' && (
          <p>
            Your order is currently{' '}
            <span className="font-semibold text-primary">
              {STEPS[currentStepIndex]?.label}
            </span>
            .
          </p>
        )}
        {currentStatus === 'completed' && (
          <p className="font-semibold text-green-600">
            Your order has been delivered successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderStatusTracker;