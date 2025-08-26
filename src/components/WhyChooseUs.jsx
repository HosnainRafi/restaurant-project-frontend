// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '🍽️',
      title: 'Delicious Food',
      description:
        'Freshly prepared meals crafted by our expert chefs with love and care.',
      color: 'from-yellow-400 to-yellow-500',
    },
    {
      icon: '⭐',
      title: 'Top Quality',
      description:
        'We source the finest ingredients to ensure every bite is unforgettable.',
      color: 'from-pink-400 to-pink-500',
    },
    {
      icon: '🚀',
      title: 'Fast Service',
      description:
        'Quick, friendly, and reliable service to make your experience smooth.',
      color: 'from-indigo-400 to-indigo-500',
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-72 h-72 bg-primary/10 rounded-full absolute -top-20 -left-20 blur-3xl"></div>
        <div className="w-96 h-96 bg-pink-100/20 rounded-full absolute -bottom-32 -right-32 blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-primary mb-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Us
        </motion.h2>

        <motion.p
          className="text-gray-600 text-base md:text-lg mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          We combine quality, taste, and service to give you the ultimate dining
          experience.
        </motion.p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-10 bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl transition-transform duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <motion.div
                className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-tr ${feature.color} text-white text-3xl shadow-lg`}
                whileHover={{
                  scale: 1.3,
                  rotate: 10,
                  boxShadow: '0px 0px 20px rgba(0,0,0,0.2)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
