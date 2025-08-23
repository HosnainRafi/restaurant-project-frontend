import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { ImSpinner3 } from "react-icons/im";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Helper for styling status badges
const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "preparing":
      return "bg-blue-100 text-blue-800";
    case "ready":
      return "bg-cyan-100 text-cyan-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize the navigate function

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // 3. Use the correct, consolidated API endpoint
        const response = await api.get(`/auth/me/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error("Could not load order details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  // 4. Handler for the "Pay Now" button
  const handlePayNow = () => {
    navigate(`/customer/dashboard/payment/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ImSpinner3 className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-gray-500">The requested order could not be found.</p>
        <Link
          to="/dashboard/my-orders"
          className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded-lg"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isPayable =
    order.paymentStatus === "unpaid" && order.status !== "cancelled";

  return (
    <div className="p-6 md:p-10 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto my-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Order #{order.orderNumber}
          </h2>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 capitalize rounded-full text-sm font-medium ${getStatusClass(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Items Ordered
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${(order.subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${(order.tax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${(order.total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Payment:</span>
              <span
                className={`px-3 py-1 text-xs capitalize font-semibold rounded-full ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. Conditionally render the "Pay Now" button --- */}
      {isPayable && (
        <div className="mt-8 pt-6 border-t text-center">
          <h3 className="text-lg font-semibold mb-3">This order is unpaid.</h3>
          <button
            onClick={handlePayNow}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/customer/dashboard/my-orders"
          className="text-sm text-gray-600 hover:text-primary"
        >
          ← Back to All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
