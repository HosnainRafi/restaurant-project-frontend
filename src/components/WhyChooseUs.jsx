const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/40">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          Why Choose Us
        </h2>
        <p className="text-text-secondary mt-2 mb-12 text-sm md:text-base max-w-2xl mx-auto">
          We combine quality, taste, and service to give you the ultimate dining
          experience.
        </p>

        {/* Static 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6 text-2xl font-bold">
              🍽️
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delicious Food
            </h3>
            <p className="text-gray-600 text-sm">
              Freshly prepared meals crafted by our expert chefs with love and
              care.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6 text-2xl font-bold">
              ⭐
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Top Quality
            </h3>
            <p className="text-gray-600 text-sm">
              We source the finest ingredients to ensure every bite is
              unforgettable.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition duration-300">
            <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-full mx-auto mb-6 text-2xl font-bold">
              🚀
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fast Service
            </h3>
            <p className="text-gray-600 text-sm">
              Quick, friendly, and reliable service to make your experience
              smooth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
