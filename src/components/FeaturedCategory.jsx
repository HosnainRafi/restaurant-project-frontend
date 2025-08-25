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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Featured Categories
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-10 max-w-xl mx-auto text-base md:text-lg">
          Handpicked categories by our chefs to make your dining experience
          extra special.
        </p>

        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(item => (
              <Link
                key={item._id}
                to="/menu"
                state={{ categoryName: item?.name }}
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-500 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={item?.imageUrl}
                    alt={item.name}
                    className="w-full h-40 sm:h-48 md:h-44 lg:h-52 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm md:text-base text-gray-200 line-clamp-2">
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
