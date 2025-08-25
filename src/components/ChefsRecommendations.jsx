import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import SingleMenuItem from './SingleMenuItem';

const ChefsRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu-items/special', {
        params: { flag: 'isChefsRecommendation' },
      });

      const data = res?.data?.data || [];
          setMenuItems(data.slice(0, 4));
    } catch (e) {
      toast.error(e?.message || 'Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-primary text-center">
          Chef’s Recommendations
        </h2>
        <p className="text-text-secondary text-center mt-4 mb-12 max-w-2xl mx-auto">
          Specially curated dishes by our head chef to give a signature
          experience.
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && menuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-500 max-w-md">
              Our chef is currently preparing something special for you. Please
              check back later for exclusive recommendations.
            </p>
          </div>
        )}

        {/* Items */}
        {!loading && menuItems.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {menuItems.map(item => (
              <SingleMenuItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChefsRecommendations;
