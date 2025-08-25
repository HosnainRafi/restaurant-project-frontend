/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#8B1E3F] text-white z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-[url('https://i.postimg.cc/h4TvMVmX/bannder-Image.jpg')] bg-cover bg-center"
        initial={{ scale: 1.2, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />

      {/* Brand Title */}
      <motion.h1
        className="text-6xl md:text-7xl font-extrabold tracking-widest relative z-10"
        initial={{ scale: 1.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        Urban Grill
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-4 text-lg md:text-xl font-light tracking-wide opacity-80 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Savor the Flavor • Crafted with Passion
      </motion.p>

      {/* Loading Bar */}
      <motion.div
        className="mt-8 h-1 w-48 bg-white/20 rounded-full overflow-hidden relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-1 bg-white rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 1.6,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
