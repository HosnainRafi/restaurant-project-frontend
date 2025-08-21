const OurChefs = () => {
  const chefs = [
    {
      name: 'Liam Carter',
      role: 'Head Chef',
      image: 'https://i.postimg.cc/vZhx8prw/chefs.jpg',
    },
    {
      name: 'Sophia Bennett',
      role: 'Pastry Chef',
      image: 'https://i.postimg.cc/vZhx8prw/chefs.jpg',
    },
    {
      name: 'Daniel Rossi',
      role: 'Sous Chef',
      image: 'https://i.postimg.cc/vZhx8prw/chefs.jpg',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Meet Our Chefs
        </h2>
        <p className="text-text-secondary text-center mt-2 mb-10 text-sm md:text-base max-w-2xl mx-auto">
          Our talented chefs bring passion and creativity to every dish, making
          your dining experience unforgettable.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {chefs.map((chef, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              {/* Chef Image */}
              <img
                src={chef.image}
                alt={chef.name}
                className="w-full h-[300px] object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-semibold text-white">
                  {chef.name}
                </h3>
                <p className="text-gray-200">{chef.role}</p>
              </div>

              {/* Bottom Content (Always Visible) */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 text-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {chef.name}
                </h3>
                <p className="text-sm text-gray-500">{chef.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurChefs;
