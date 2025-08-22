import { useReducer, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_CART': // for initializing from localStorage
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

// Load initial state from localStorage
const getInitialState = () => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? { items: JSON.parse(storedCart) } : { items: [] };
};

export const CartProvider = ({ children }) => {
  const { user, dbUser } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {}, getInitialState);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  const checkUserAndRole = () => {
    if (!user) {
      toast.error('Please login first');
      return false;
    }
    if (dbUser?.role !== 'customer') {
      toast.error('Only customers can perform this action');
      return false;
    }
    return true;
  };

  const addItem = item => {
    if (!checkUserAndRole()) return;
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item?.name} added to cart`);
  };

  const removeItem = id => {
    if (!checkUserAndRole()) return;
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    if (!checkUserAndRole()) return;
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cartItems'); // clear localStorage
    toast.success('Cart cleared successfully');
  };

  const value = {
    items: state.items,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
