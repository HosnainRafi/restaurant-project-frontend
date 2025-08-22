import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SingleMenuItem from './SingleMenuItem';
import toast from 'react-hot-toast';

const FeaturedDishes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu-items/special', {
        params: { flag: 'isFeatured' },
      });
      const data = res?.data?.data || [];
      setItems(data);
    } catch (e) {
      toast.error(e?.message || 'Failed to load featured items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Featured Dishes
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Handpicked specialties from our kitchen to delight your taste buds.
        </p>

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Featured Items
            </h3>
            <p className="text-gray-500 max-w-md text-center mb-6">
              Currently, we don’t have any featured dishes available. Check back
              later for something delicious!
            </p>
            <Link
              to="/menu"
              className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
            >
              Explore Menu
            </Link>
          </div>
        )}

        {/* Items */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {items.map(item => (
              <SingleMenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;
