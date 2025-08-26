import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import SingleMenuItem1 from './SingleMenuItem1';

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTodaysSpecials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu-items/special', {
        params: { flag: 'isTodaysSpecial' },
      });

      const data = res?.data?.data || [];
      setMenuItems(data);
    } catch (e) {
      toast.error(e.message || 'Failed to load today’s specials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysSpecials();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Today’s Specials
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Handpicked dishes for today to delight your taste buds.
        </p>

        {/* Empty State */}
        {!loading && menuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-md border border-gray-200">
            <img
              src="https://illustrations.popsy.co/gray/no-data.svg"
              alt="No specials"
              className="w-40 h-40 mb-6 opacity-80"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              No Specials Available
            </h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">
              Our chefs are busy crafting new delights. Please check back later
              for today’s special dishes!
            </p>
          </div>
        )}

        {/* Specials Grid */}
        {!loading && menuItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map(item => (
              <SingleMenuItem1 key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysMenu;
