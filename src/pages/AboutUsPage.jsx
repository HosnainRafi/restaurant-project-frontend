const AboutUsPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative bg-fixed bg-center bg-cover h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/h4TvMVmX/bannder-Image.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white mt-4 max-w-2xl mx-auto drop-shadow-md">
            Learn who we are, what we stand for, and why our community trusts
            us.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-gray-800">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            Our company is dedicated to providing the best experience for our
            users. We believe in innovation, quality, and community. Our team
            works tirelessly to bring cutting-edge solutions that help our
            clients succeed in their goals.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Transparency, integrity, and customer satisfaction are at the core
            of everything we do. Join us on our journey to make a meaningful
            impact.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://i.postimg.cc/SRPh7S4F/Grill-BBQ.jpg"
            alt="About Us"
            className="rounded-xl shadow-2xl object-cover w-full"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            We strive to empower our users with innovative tools and a
            supportive community. Our mission is to create solutions that make
            life easier, more productive, and more enjoyable for everyone.
          </p>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-24 bg-primary text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
        <p className="max-w-2xl mx-auto mb-6">
          Be part of our growing network and experience all the benefits our
          platform has to offer.
        </p>
        <button className="px-8 py-3 bg-primary-hover rounded-lg font-semibold shadow-lg hover:opacity-90 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default AboutUsPage;
