import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import SingleMenuItem from './SingleMenuItem';

const ChefsRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/menu-items');
        const recommendations = res.data.data.slice(0, 4);
        setMenuItems(recommendations);
      } catch (err) {
        toast.error('Failed to load recommendations.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-primary text-center">
          Chef’s Recommendations
        </h2>
        <p className="text-text-secondary text-center mt-4 mb-12 max-w-2xl mx-auto">
          Specially curated dishes by our head chef to give you a signature
          experience.
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
          {menuItems.map(item => (
            <SingleMenuItem key={item?._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefsRecommendations;
