import { useEffect, useState } from "react";
import { FaBoxOpen, FaCalendarAlt, FaStar, FaRegStar } from "react-icons/fa";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const DeliveredOrders = () => {
  const { user, dbUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // UPDATED: Use the new endpoint that includes review data
        const response = await api.get("/orders/my-orders");
        const completed = response.data.data.filter(
          (order) => order.status === "completed"
        );
        setOrders(completed);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReviewChange = (id, text) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], text },
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], text: "" },
    }));
  };

  const handleRatingChange = (id, rating) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], rating },
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], rating: "" },
    }));
  };

  const submitReview = async (orderId) => {
    const review = reviews[orderId] || {};
    let error = {};

    if (!review.text) error.text = "Review cannot be empty";
    if (!review.rating) error.rating = "Please select a rating";

    setErrors((prev) => ({ ...prev, [orderId]: error }));
    if (Object.keys(error).length > 0) return;

    try {
      console.log("Submitting review for order:", orderId); // DEBUG LOG

      const { data } = await api.post("/reviews", {
        orderId: orderId, // Make sure this is the correct order ID
        rating: review.rating,
        comment: review.text,
      });

      console.log("Review submitted:", data);

      // Update the orders list to reflect the new review
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, review: data.data } : order
        )
      );

      // Clear review input after successful submission
      setReviews((prev) => ({ ...prev, [orderId]: {} }));
    } catch (err) {
      console.error(
        "Review submission error:",
        err.response?.data || err.message
      );
      setErrors((prev) => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          api:
            err.response?.data?.message ||
            "Something went wrong. Please try again.",
        },
      }));
    }
  };

  if (loading) return <div className="p-4">Loading delivered orders...</div>;
  if (orders.length === 0)
    return <div className="p-4">No completed orders found.</div>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow-md p-6 border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaBoxOpen className="text-green-600" />
              <span className="font-semibold">Order #{order.orderNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <FaCalendarAlt />
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Items:</h4>
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {item.name} × {item.quantity} - $
                  {(item.price / 100).toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Existing Review Display */}
          {order.review ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Your Review:</h4>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < order.review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({order.review.rating}/5)
                </span>
              </div>
              <p className="text-gray-700">{order.review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                Reviewed on{" "}
                {new Date(order.review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            /* Review Form */
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Leave a Review:</h4>

              {/* Rating */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Rating:
                </label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => {
                    const rating = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => handleRatingChange(order._id, rating)}
                        className="focus:outline-none"
                      >
                        {(reviews[order._id]?.rating || 0) >= rating ? (
                          <FaStar className="text-yellow-400 w-5 h-5" />
                        ) : (
                          <FaRegStar className="text-gray-400 w-5 h-5" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors[order._id]?.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[order._id].rating}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Comment:
                </label>
                <textarea
                  value={reviews[order._id]?.text || ""}
                  onChange={(e) =>
                    handleReviewChange(order._id, e.target.value)
                  }
                  placeholder="Share your experience..."
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                />
                {errors[order._id]?.text && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[order._id].text}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => submitReview(order._id)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Submit Review
              </button>

              {errors[order._id]?.api && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[order._id].api}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliveredOrders;
