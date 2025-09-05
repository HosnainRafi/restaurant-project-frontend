import { useEffect, useState } from 'react';
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaChevronDown,
} from 'react-icons/fa';
import api from '@/lib/api';
import { AiOutlineInbox, AiOutlineLoading3Quarters } from 'react-icons/ai';

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [errors, setErrors] = useState({});
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        const completed = response.data.data.filter(
          order => order.status === 'completed'
        );
        setOrders(completed);

        // Auto-open the last completed order
        if (completed.length > 0) {
          setOpenOrderId(completed[0]._id);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReviewChange = (id, text) => {
    setReviews(prev => ({
      ...prev,
      [id]: { ...prev[id], text },
    }));
    setErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], text: '' },
    }));
  };

  const handleRatingChange = (id, rating) => {
    setReviews(prev => ({
      ...prev,
      [id]: { ...prev[id], rating },
    }));
    setErrors(prev => ({
      ...prev,
      [id]: { ...prev[id], rating: '' },
    }));
  };

  const submitReview = async orderId => {
    const review = reviews[orderId] || {};
    let error = {};

    if (!review.text) error.text = 'Review cannot be empty';
    if (!review.rating) error.rating = 'Please select a rating';

    setErrors(prev => ({ ...prev, [orderId]: error }));
    if (Object.keys(error).length > 0) return;

    try {
      const { data } = await api.post('/reviews', {
        orderId,
        rating: review.rating,
        comment: review.text,
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, review: data.data } : order
        )
      );

      setReviews(prev => ({ ...prev, [orderId]: {} }));
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          api:
            err.response?.data?.message ||
            'Something went wrong. Please try again.',
        },
      }));
    }
  };

  if (loading)
    return (
      <div className="p-6 flex items-center space-x-3 text-primary">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
        <span className="text-lg font-semibold">
          Loading delivered orders...
        </span>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="p-6 flex items-center space-x-3 min-h-screen justify-center text-primary">
        <AiOutlineInbox className="text-3xl" />
        <span className="text-lg font-semibold">
          No completed orders found.
        </span>
      </div>
    );

  return (
    <div className="space-y-4 p-6 md:p-10 bg-gray-50 min-h-screen">
      {orders.map(order => {
        const isOpen = openOrderId === order._id;

        // ✅ Show first item name + "x more" if multiple
        const firstItem = order.items[0]?.name || 'Unknown Item';
        const moreCount = order.items.length - 1;
        const itemDisplay =
          moreCount > 0 ? `${firstItem} +${moreCount} more` : firstItem;

        return (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow border transition-all"
          >
            {/* Accordion Header */}
            <button
              onClick={() => setOpenOrderId(isOpen ? null : order._id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg"
            >
              <div className="flex items-center space-x-2">
                <FaBoxOpen className="text-green-600" />
                <span className="font-medium text-gray-700 text-sm">
                  {itemDisplay}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <FaCalendarAlt />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <FaChevronDown
                  className={`transform transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 text-sm text-gray-600 border-t">
                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-1 text-gray-700">Items</h4>
                  <div className="space-y-0.5">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.quantity} – $
                        {(item.price / 100).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Existing Review */}
                {order.review ? (
                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-medium text-green-700 mb-1">
                      Your Review
                    </h4>
                    <div className="flex items-center mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < order.review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="ml-2 text-xs text-gray-500">
                        ({order.review.rating}/5)
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      {order.review.comment}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <h4 className="font-medium text-gray-700">
                      Leave a Review
                    </h4>

                    {/* Rating */}
                    <div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => {
                          const rating = i + 1;
                          return (
                            <button
                              key={i}
                              onClick={() =>
                                handleRatingChange(order._id, rating)
                              }
                              className="focus:outline-none"
                            >
                              {(reviews[order._id]?.rating || 0) >= rating ? (
                                <FaStar className="text-yellow-400 w-4 h-4" />
                              ) : (
                                <FaRegStar className="text-gray-400 w-4 h-4" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {errors[order._id]?.rating && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[order._id].rating}
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div>
                      <textarea
                        value={reviews[order._id]?.text || ''}
                        onChange={e =>
                          handleReviewChange(order._id, e.target.value)
                        }
                        placeholder="Share your experience..."
                        className="w-full p-2 border rounded-md resize-none text-sm"
                        rows={2}
                      />
                      {errors[order._id]?.text && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[order._id].text}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => submitReview(order._id)}
                      className="bg-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-dark transition-colors"
                    >
                      Submit Review
                    </button>

                    {errors[order._id]?.api && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors[order._id].api}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DeliveredOrders;
