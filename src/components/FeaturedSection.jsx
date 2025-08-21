import { Link } from 'react-router-dom';

const featuredItems = [
  {
    id: 1,
    title: 'Grilled Salmon',
    description: 'Freshly grilled salmon with a hint of lemon and herbs.',
    image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
  },
  {
    id: 2,
    title: 'Classic Steak',
    description: 'Juicy premium steak cooked to perfection.',
    image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
  },
  {
    id: 3,
    title: 'Gourmet Pasta',
    description: 'Delicious pasta with creamy sauce and fresh ingredients.',
    image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
  },
  {
    id: 4,
    title: 'Exotic Desserts',
    description: 'Sweet delights to complete your dining experience.',
    image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
  },
];

const FeaturedSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Featured Dishes
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Handpicked specialties from our kitchen to delight your taste buds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map(item => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex flex-col justify-end p-4">
                <h3 className="text-xl font-semibold text-background group-hover:text-primary transition">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-background/80">
                  {item.description}
                </p>
                <Link
                  to="/menu"
                  className="mt-3 flex bg-primary text-white px-4 py-1.5 justify-center rounded-md shadow-md hover:bg-primary-hover transition"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
