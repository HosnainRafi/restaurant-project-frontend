import { useEffect, useState } from 'react';
import { FaBoxOpen, FaCalendarAlt, FaStar, FaRegStar } from 'react-icons/fa';
import api from '@/lib/api';

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/auth/me/orders');
        const delivered = response.data.data.filter(
          order => order.status === 'completed'
        );
        setOrders(delivered);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReviewChange = (id, text) => {
    setReviews(prev => ({ ...prev, [id]: { ...prev[id], text } }));
    setErrors(prev => ({ ...prev, [id]: { ...prev[id], text: '' } }));
  };

  const handleRatingChange = (id, rating) => {
    setReviews(prev => ({ ...prev, [id]: { ...prev[id], rating } }));
    setErrors(prev => ({ ...prev, [id]: { ...prev[id], rating: '' } }));
  };

  const submitReview = id => {
    const review = reviews[id] || {};
    let error = {};
    if (!review.text) error.text = 'Review cannot be empty';
    if (!review.rating) error.rating = 'Please select a rating';
    setErrors(prev => ({ ...prev, [id]: error }));
    if (Object.keys(error).length > 0) return;

    // Simulate API call will be here
    console.log('Review submitted:', { id, review });
    setReviews(prev => ({ ...prev, [id]: {} }));
  };

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">
        Loading delivered orders...
      </p>
    );
  if (orders.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No delivered orders found.
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-[#8B1E3F]">
        Delivered Orders
      </h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaBoxOpen className="text-[#8B1E3F] text-lg" />
                <h2 className="font-semibold text-gray-800">
                  {order.orderNumber}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <FaCalendarAlt />
                {new Date(order.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600">
                    {item.quantity} × ${(item.price / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm font-medium mb-4 border-t pt-2">
              <span>Total</span>
              <span className="text-[#8B1E3F] font-semibold">
                ${(order.total / 100).toFixed(2)}
              </span>
            </div>

            {/* Review Section */}
            <div className="border-t pt-3 mt-2">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => {
                  const currentRating = reviews[order._id]?.rating || 0;
                  return currentRating >= star ? (
                    <FaStar
                      key={star}
                      className="text-[#8B1E3F] cursor-pointer"
                      onClick={() => handleRatingChange(order._id, star)}
                    />
                  ) : (
                    <FaRegStar
                      key={star}
                      className="text-gray-400 cursor-pointer hover:text-[#8B1E3F]"
                      onClick={() => handleRatingChange(order._id, star)}
                    />
                  );
                })}
              </div>
              {errors[order._id]?.rating && (
                <p className="text-red-500 text-xs mb-2">
                  {errors[order._id].rating}
                </p>
              )}

              <textarea
                placeholder="Write your review..."
                value={reviews[order._id]?.text || ''}
                onChange={e => handleReviewChange(order._id, e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#8B1E3F] outline-none mb-1 ${
                  errors[order._id]?.text ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={2}
              />
              {errors[order._id]?.text && (
                <p className="text-red-500 text-xs mb-2">
                  {errors[order._id].text}
                </p>
              )}

              <button
                onClick={() => submitReview(order._id)}
                className="bg-[#8B1E3F] text-white px-4 py-1.5 text-sm rounded-lg hover:bg-[#731935] transition"
              >
                Submit Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveredOrders;
