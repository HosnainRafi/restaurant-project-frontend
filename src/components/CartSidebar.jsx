import { useRef, useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useNavigate } from "react-router-dom"; // 👈 1. Import useNavigate

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, removeItem, clearCart } = useCart();
  const cartRef = useRef();
  const navigate = useNavigate(); // 👈 2. Get the navigate function

  useOnClickOutside(cartRef, onClose);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const formattedSubtotal = (subtotal / 100).toFixed(2);

  // 👇 3. Create a new handler function
  const handleCheckout = () => {
    navigate("/checkout"); // First, navigate to the checkout page
    onClose(); // Then, close the sidebar
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div ref={cartRef} className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow p-6 overflow-y-auto">
          {/* ... item mapping logic ... */}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-lg font-bold">${formattedSubtotal}</span>
            </div>
            {/* 👇 4. Change the Link to a Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-center text-sm text-gray-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
