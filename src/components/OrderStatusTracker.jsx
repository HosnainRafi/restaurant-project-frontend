import { motion } from "framer-motion";
import {
  FaCheck,
  FaBox,
  FaFire,
  FaClipboardCheck,
  FaRegClock,
} from "react-icons/fa";

const STEPS = [
  { id: "pending", label: "Pending", icon: FaRegClock },
  { id: "confirmed", label: "Confirmed", icon: FaCheck },
  { id: "preparing", label: "Preparing", icon: FaFire },
  { id: "ready", label: "Ready", icon: FaBox },
  { id: "completed", label: "Completed", icon: FaClipboardCheck },
];

const OrderStatusTracker = ({ currentStatus }) => {
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStatus);

  if (currentStatus === "cancelled") {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center font-semibold">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold mb-8 text-center text-gray-800">
        Track Your Order
      </h3>
      <div className="flex justify-between items-center relative mx-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200" />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
          }}
          transition={{ ease: "easeInOut", duration: 0.8 }}
        />

        {STEPS.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="z-10 flex flex-col items-center w-20">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <step.icon
                  className={`w-6 h-6 transition-colors duration-500 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </motion.div>
              <p
                className={`mt-2 font-semibold text-sm transition-colors duration-500 text-center ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
