import { useEffect, useState, useMemo, useRef } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import SingleMenuItem1 from '@/components/SingleMenuItem1';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ITEMS_PER_PAGE = 8;

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const tabContainerRef = useRef(null);
  const location = useLocation();
  const categoryName = location.state?.categoryName || null;

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

        if (categoryName) {
          const matchedCategory = categoriesRes.data.data.find(
            cat => cat.name.toLowerCase() === categoryName.toLowerCase()
          );
          setActiveTab(matchedCategory ? matchedCategory._id : 'all');
        } else {
          setActiveTab('all');
        }
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        toast.error('Failed to load menu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  const menuByCategory = useMemo(() => {
    if (!Array.isArray(categories) || !Array.isArray(menuItems)) return {};
    return categories.reduce((acc, category) => {
      acc[category._id] = {
        name: category.name,
        items: menuItems.filter(item => item.categoryId?._id === category._id),
      };
      return acc;
    }, {});
  }, [categories, menuItems]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1E3F]"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500 font-medium">
        {error}
      </div>
    );

  const getVisibleItems = () => {
    if (activeTab === 'all') return menuItems.slice(0, visibleCount);
    const selectedCategory = menuByCategory[activeTab];
    return selectedCategory?.items.slice(0, visibleCount) || [];
  };

  const hasMore = () => {
    if (activeTab === 'all') return visibleCount < menuItems.length;
    const selectedCategory = menuByCategory[activeTab];
    return selectedCategory?.items.length > visibleCount;
  };

  const scrollTabs = direction => {
    if (!tabContainerRef.current) return;
    const scrollAmount = 150;
    tabContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const renderItems = () => {
    const items = getVisibleItems();

    if (items.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl shadow-inner">
          <p className="text-lg font-medium">No items found.</p>
          <p className="text-sm mt-2">Try exploring other categories.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div
              key={item._id}
              className="transform transition hover:-translate-y-1 hover:shadow-xl duration-300"
            >
              <SingleMenuItem1 item={item} />
            </div>
          ))}
        </div>

        {hasMore() && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              className="px-6 py-2 rounded-full bg-[#8B1E3F] text-white font-medium shadow-md hover:bg-[#a52a4f] transition"
            >
              Load More
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-fixed bg-center bg-cover h-[250px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/6p2mGVTQ/menubanner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Explore Our Menu
          </h1>
          <p className="text-lg md:text-xl text-white mt-2 drop-shadow-md max-w-2xl mx-auto">
            Discover delicious meals crafted with care and passion. Choose from
            a variety of categories and satisfy your cravings.
          </p>
        </div>
      </section>

      {/* Tab Navigation with Arrows */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center relative">
          <button
            onClick={() => scrollTabs('left')}
            className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hidden md:block"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={tabContainerRef}
            className="flex gap-4 overflow-x-hidden scroll-smooth mx-6"
          >
            <button
              onClick={() => {
                setActiveTab('all');
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className={`px-3 py-2 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white border border-b-0 border-gray-200 text-[#8B1E3F] shadow-sm'
                  : 'text-gray-600 hover:text-[#8B1E3F]'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => {
                  setActiveTab(category._id);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-3 py-2 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === category._id
                    ? 'bg-white border border-b-0 border-gray-200 text-[#8B1E3F] shadow-sm'
                    : 'text-gray-600 hover:text-[#8B1E3F]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollTabs('right')}
            className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 hidden md:block"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">{renderItems()}</div>
    </div>
  );
};

export default MenuPage;
