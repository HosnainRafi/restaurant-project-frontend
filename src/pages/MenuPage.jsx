import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SingleMenuItem from '@/components/SingleMenuItem';
import { useLocation } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const categoryName = location.state?.categoryName || null;

  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, itemsRes] = await Promise.all([
          api.get('/menu-categories'),
          api.get('/menu-items'),
        ]);

        setCategories(categoriesRes.data.data);
        setMenuItems(itemsRes.data.data);
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        toast.error('Failed to load menu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const menuByCategory = useMemo(() => {
    if (!Array.isArray(categories) || !Array.isArray(menuItems)) {
      return {};
    }

    return categories.reduce((acc, category) => {
      acc[category._id] = {
        name: category.name,
        items: menuItems.filter(item => item.categoryId?._id === category._id),
      };
      return acc;
    }, {});
  }, [categories, menuItems]);

  useEffect(() => {
    if (categoryName && categories.length > 0) {
      const matchedCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (matchedCategory && categoryRefs.current[matchedCategory._id]) {
        const element = categoryRefs.current[matchedCategory._id];
        const yOffset = -100; 
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [categoryName, categories]);

  if (isLoading) {
    return <div className="text-center py-10">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28">
      <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10">
        Our Menu
      </h2>

      {categories.map(
        category =>
          menuByCategory[category._id]?.items.length > 0 && (
            <div
              key={category._id}
              ref={el => (categoryRefs.current[category._id] = el)}
              className="mb-16"
            >
              <h2 className="text-3xl font-semibold mb-6 border-b-2 border-gray-200 pb-2">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuByCategory[category._id]?.items.map(item => (
                  <SingleMenuItem key={item._id} item={item} />
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default MenuPage;
