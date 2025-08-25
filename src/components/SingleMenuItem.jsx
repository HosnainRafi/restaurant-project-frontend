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
    <div className="group grid grid-cols-12 rounded-xl shadow-lg overflow-hidden transition hover:shadow-2xl">
      {/* Content */}
      <div className="col-span-9 px-6 py-4 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
          <p className="mt-2 text-text-secondary">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            $ {formattedPrice}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAddToCart(item.id)}
              className="ml-2 flex items-center gap-1 bg-primary text-white px-2 py-1.5 rounded-[3px] text-xs hover:bg-primary-hover transition"
            >
              <FaCartPlus size={12} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-3 overflow-hidden">
        <img
          src={item.imageUrl || 'https://i.postimg.cc/yNmbwGV3/category1.jpg'}
          alt={item.name}
          className="w-full h-36 object-center object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 hover:animate-spin"
        />
      </div>
    </div>
  );
};

export default SingleMenuItem;
