import { motion } from 'framer-motion';

const SplashScreen = () => {
  const dotVariants = {
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 0.9,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#8B1E3F]/80 to-[#FDEDEE] z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Brand Text */}
      <motion.h1
        className="text-[#8B1E3F] text-5xl md:text-6xl font-extrabold tracking-wider drop-shadow-lg"
        initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        Urban Grill
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-4 text-white text-sm md:text-base opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Experience the taste of perfection
      </motion.p>

      {/* Continuous Loading Dots */}
      <div className="flex space-x-2 mt-6">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-3 h-3 bg-white rounded-full shadow-lg"
            variants={dotVariants}
            animate="animate"
            style={{ transitionDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
