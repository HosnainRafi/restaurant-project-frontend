import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/qRYC4K3C/bannder-Image.jpg')",
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-background drop-shadow-lg">
          Welcome to Urban Grill
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-background/80 max-w-2xl mx-auto">
          Experience gourmet dishes crafted with passion and served with
          elegance.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/menu"
            className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-hover transition"
          >
            Explore Menu
          </Link>
          <Link
            to="/reservations"
            className="bg-secondary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary-hover transition"
          >
            Book a Table
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
