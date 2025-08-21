import { useCart } from "../hooks/useCart"; // 👈 Import the useCart hook
import toast from "react-hot-toast";

const MenuItemCard = ({ item }) => {
  const formattedPrice = (item.price / 100).toFixed(2);
  const { addItem } = useCart(); // 👈 Get the addItem function from the context

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      </div>

      <div className="px-6 pb-4 flex justify-between items-center mt-auto">
        <span className="text-lg font-semibold text-gray-800">
          ${formattedPrice}
        </span>
        {/* ✅ Add the "Add to Cart" button */}
        <button
          onClick={handleAddToCart}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
