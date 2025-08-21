
import { useEffect, useState } from 'react';
import SingleMenuItem from './SingleMenuItem';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// const todaysMenu = [
//   {
//     id: 1,
//     name: 'Grilled Salmon',
//     description: 'Freshly grilled salmon with a hint of lemon and herbs.',
//     price: 18,
//     image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
//   },
//   {
//     id: 2,
//     name: 'Classic Steak',
//     description: 'Juicy premium steak cooked to perfection.',
//     price: 22,
//     image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
//   },
//   {
//     id: 3,
//     name: 'Gourmet Pasta',
//     description: 'Delicious pasta with creamy sauce and fresh ingredients.',
//     price: 15,
//     image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
//   },
//   {
//     id: 4,
//     name: 'Exotic Desserts',
//     description: 'Sweet delights to complete your dining experience.',
//     price: 10,
//     image: 'https://i.postimg.cc/yNmbwGV3/category1.jpg',
//   },
// ];

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [ itemsRes] = await Promise.all([
            api.get('/menu-items'),
          ]);

          setMenuItems(itemsRes.data.data);
        } catch (err) {
          toast.error('Failed to load menu.');
          console.error(err);
        }
      };

      fetchData();
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {menuItems.map(item => (
            <SingleMenuItem key={item?._id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodaysMenu;
