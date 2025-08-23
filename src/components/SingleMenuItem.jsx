import { useCart } from '@/hooks/useCart';
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
    <div className="grid grid-cols-12 rounded-xl shadow-lg overflow-hidden transition hover:shadow-2xl">
      {/* Content */}
      <div className="col-span-9 p-6 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
          <p className="mt-2 text-text-secondary">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formattedPrice}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAddToCart(item.id)}
              className="ml-2 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary-hover transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-3 overflow-hidden">
        <img
          src={item.imageUrl || 'https://i.postimg.cc/yNmbwGV3/category1.jpg'}
          alt={item.name}
          className="w-full h-40 object-center object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>
    </div>
  );
};

export default SingleMenuItem;
