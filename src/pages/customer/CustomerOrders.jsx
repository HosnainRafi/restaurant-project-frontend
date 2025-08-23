import { useState, useEffect } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Helper to apply colors based on order status
const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "preparing":
      return "bg-blue-100 text-blue-700";
    case "ready":
      return "bg-cyan-100 text-cyan-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/auth/me/orders");
        setOrders(response.data.data);
      } catch (error) {
        toast.error("Failed to load your orders.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/customer/dashboard/my-orders/${orderId}`); // Navigate to the new detail page
  };

  const handlePayNow = (orderId) => {
    navigate(`/customer/dashboard/payment/${orderId}`);
  };

  const handleCancelOrder = async (order) => {
    // --- THIS IS THE NEW LOGIC ---
    if (order.paymentStatus === "paid") {
      alert(
        "This is a paid order. Please call 1-800-RESTAURANT to request a cancellation and refund."
      );
      return;
    }

    if (window.confirm("Are you sure you want to cancel this order?")) {
      toast.loading("Cancelling order...");
      try {
        await api.patch(`/auth/me/orders/${order._id}/cancel`);
        toast.dismiss();
        toast.success("Order successfully cancelled!");
        // Refresh the list to show the updated status
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o._id === order._id ? { ...o, status: "cancelled" } : o
          )
        );
      } catch (error) {
        toast.dismiss();
        toast.error(
          error.response?.data?.message || "Could not cancel the order."
        );
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        My Orders
      </h2>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <ImSpinner3 className="animate-spin text-primary text-3xl" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You have no orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 w-36">
                    Actions
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  // const isCancellable =
                  //   order.status === "pending" || order.status === "confirmed";
                  return (
                    <tr
                      key={order._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-sm">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{order.items.length}</td>
                      <td className="px-4 py-3 font-semibold">
                        ${(order.total / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 capitalize rounded-full text-xs font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="w-full bg-primary text-white text-sm py-1 rounded-md hover:bg-primary/90 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order)} // Pass the full order object
                          disabled={
                            order.status === "cancelled" ||
                            order.status === "completed"
                          }
                          className="w-full bg-gray-200 text-gray-700 text-sm py-1 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {order.paymentStatus === "unpaid" &&
                        order.status !== "cancelled" ? (
                          <button
                            onClick={() => handlePayNow(order._id)}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            Pay Now
                          </button>
                        ) : (
                          <span className="capitalize">
                            {order.paymentStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
