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
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div ref={cartRef} className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-700 hover:text-red-500 transition"
          >
            <FiX />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow p-4 overflow-y-auto space-y-3">
          {items.length === 0 && (
            <p className="text-gray-400 text-center mt-10 text-sm">
              Your cart is empty.
            </p>
          )}
          {items.map(item => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={item.imageUrl || '/default-avatar.png'}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-gray-500 text-xs">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500 hover:text-red-700 transition text-xl p-1"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Subtotal:</span>
              <span>${formattedSubtotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-hover transition text-sm"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition text-sm flex justify-center items-center space-x-2"
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
