import { useCart } from '@/hooks/useCart';
import { FaCartPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

const SingleMenuItem = ({ item }) => {
  const formattedPrice = (item.price / 100).toFixed(2);
  const { addItem } = useCart();
  const { HandleCardPanelOpen } = useOutletContext();

  const handleAddToCart = () => {
    addItem(item);
    HandleCardPanelOpen();
  };

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
      {/* Image */}
      <img
        src={item.imageUrl || 'https://i.postimg.cc/yNmbwGV3/category1.jpg'}
        alt={item.name}
        className="w-full h-40 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />

      {/* Gradient shadow bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"></div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-light">
            ${formattedPrice}
          </span>
          <button
            onClick={handleAddToCart}
            className="ml-2 flex items-center gap-1 bg-primary px-2 py-1.5 rounded text-xs font-medium hover:bg-primary-hover transition"
          >
            <FaCartPlus size={14} />
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleMenuItem;
