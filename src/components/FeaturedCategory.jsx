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
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Featured Categories
        </h2>
        <p className="text-text-secondary text-center mt-2 mb-8 max-w-xl mx-auto text-sm md:text-base">
          Handpicked categories by our chefs to make your dining experience
          extra special.
        </p>

        {categories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(item => (
              <Link
                key={item._id}
                to="/menu"
                state={{ categoryName: item?.name }}
                className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item?.imageUrl}
                    alt={item.name}
                    className="w-full h-28 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex flex-col justify-end p-3">
                  <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-primary transition">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                    {item?.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategory;
