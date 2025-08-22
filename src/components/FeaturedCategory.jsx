import api from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FeaturedCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const [categoriesRes] = await Promise.all([api.get('/menu-categories')]);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch menu data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const demoImage = 'https://i.postimg.cc/HW360HhN/category.jpg';
  const demoDescription = 'Delicious chef-selected dishes curated for you.';

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Featured Category
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Explore our chef-selected dishes, crafted with passion and premium
          ingredients, to give you an unforgettable dining experience.
        </p>

        {/* Items */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map(item => (
              <div
                key={item._id}
                className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <div className="overflow-hidden">
                  <img
                    src={demoImage}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex flex-col justify-end p-4">
                  <h3 className="text-xl font-semibold text-background group-hover:text-primary transition">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-background/80 line-clamp-2">
                    {demoDescription}
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
        )}
      </div>
    </section>
  );
};

export default FeaturedCategory;
