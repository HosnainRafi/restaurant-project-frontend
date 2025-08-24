import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { ImSpinner3 } from "react-icons/im";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { io } from "socket.io-client";
import OrderStatusTracker from "@/components/OrderStatusTracker";

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
  const { user } = useAuth(); // 3. Get the authenticated user
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
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

    // --- 4. Set up Socket.IO connection ---
    if (user?.uid) {
      const socket = io(import.meta.env.VITE_API_BASE_URL);

      // Join a room specific to this user to receive personal notifications
      socket.emit("join_room", `user:${user.uid}`);

      // Listen for updates to any order
      socket.on("order:updated", (updatedOrder) => {
        // Only update state if the notification is for the order we are currently viewing
        if (updatedOrder._id === orderId) {
          setOrder(updatedOrder);
          toast.success(`Your order is now ${updatedOrder.status}!`);
        }
      });

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.disconnect();
      };
    }
  }, [orderId, user]);

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
    <div className="p-4 md:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* --- 1. The Animated Status Tracker --- */}
        {/* It will automatically update in real-time thanks to the socket connection */}
        <OrderStatusTracker currentStatus={order.status} />

        {/* --- 2. The Main Order Detail Card --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
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
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${(order.tax / 100).toFixed(2)}</span>
                </div>
                {order.tip > 0 && (
                  <div className="flex justify-between">
                    <span>Tip:</span>
                    <span>${(order.tip / 100).toFixed(2)}</span>
                  </div>
                )}
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

          {/* --- 3. The Conditional "Pay Now" Button --- */}
          {isPayable && (
            <div className="mt-8 pt-6 border-t text-center">
              <h3 className="text-lg font-semibold mb-3">
                This order is unpaid.
              </h3>
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
              to="/dashboard/my-orders"
              className="text-sm text-gray-600 hover:text-primary"
            >
              ← Back to All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
