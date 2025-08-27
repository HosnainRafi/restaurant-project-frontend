import { useRef, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2 } from 'react-icons/fi';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, removeItem, clearCart } = useCart();
  const cartRef = useRef();
  const navigate = useNavigate();

  useOnClickOutside(cartRef, onClose);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const formattedSubtotal = (subtotal / 100).toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-2xl overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div ref={cartRef} className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-[#8B1E3F] to-[#701830] text-white shadow-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-3">🛒</div>
              <p className="text-sm">Your cart is empty.</p>
            </div>
          )}
          {items.map(item => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-white shadow-md rounded-xl p-3 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.imageUrl || '/default-avatar.png'}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-700 transition text-lg p-2 rounded-full hover:bg-red-50"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t bg-white/80 backdrop-blur-md space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <span>Subtotal:</span>
              <span>${formattedSubtotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-[#8B1E3F] to-[#701830] text-white py-2 rounded-xl font-semibold shadow hover:opacity-90 transition text-sm"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-xl font-semibold border-2 border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#8B1E3F] hover:text-white transition text-sm flex justify-center items-center space-x-2"
            >
              <FiTrash2 />
              <span>Clear Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
