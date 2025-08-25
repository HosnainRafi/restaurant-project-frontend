import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section
      className="relative bg-fixed bg-center bg-cover py-24 md:py-32"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/h4TvMVmX/bannder-Image.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8">
        {/* Left Floating Image */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0 transform hover:-translate-y-2 transition-all duration-500">
          <img
            src="https://i.postimg.cc/SRPh7S4F/Grill-BBQ.jpg"
            alt="Left"
            className="rounded-xl shadow-2xl object-cover w-full h-64 md:h-auto"
          />
        </div>

        {/* Center Content */}
        <div className="w-full md:w-2/4 text-center text-white space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            Welcome to Our Website
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-md">
            We are dedicated to providing the best experience for our users.
            Explore our platform to discover amazing features, tools, and
            resources designed to help you succeed. Join our community and start
            your journey today!
          </p>
          <div className="mt-4">
            <Link
              to="/about-us"
              className="px-6 py-3 bg-primary hover:bg-primary-hover rounded-lg text-white font-semibold shadow-lg transition transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Floating Image */}
        <div className="w-full md:w-1/4 mt-6 md:mt-0 transform hover:-translate-y-2 transition-all duration-500">
          <img
            src="https://i.postimg.cc/HW8ddM9T/Grilled-Salmon-Fillet.jpg"
            alt="Right"
            className="rounded-xl shadow-2xl object-cover w-full h-64 md:h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
