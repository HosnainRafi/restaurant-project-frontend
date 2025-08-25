import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/du8e3wgew/video/upload/v1756105158/heroVideo_tlf8bv.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="https://res.cloudinary.com/du8e3wgew/image/upload/v1756105391/thumblail_zrvrun.png"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Welcome to <span className="text-[#8B1E3F]">Urban Grill</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          Where gourmet dishes meet a modern dining experience. Crafted with
          passion, served with elegance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            to="/menu"
            className="px-8 py-3 rounded-full text-lg font-semibold bg-[#8B1E3F] text-white shadow-lg hover:bg-[#701830] transition-all duration-300"
          >
            Explore Menu
          </Link>
          <Link
            to="/reservations"
            className="px-8 py-3 rounded-full text-lg font-semibold bg-white text-[#8B1E3F] shadow-lg hover:bg-gray-100 transition-all duration-300"
          >
            Book a Table
          </Link>
        </motion.div>
      </div>

      {/* Decorative Fade at Bottom */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 z-10 text-white flex justify-center w-full"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
