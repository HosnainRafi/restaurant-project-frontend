import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

// Helper for styling status badges
const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "ready":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await api.get("/customer/my-orders");
        setOrders(response.data.data);
      } catch (error) {
        toast.error("Failed to load your orders.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ImSpinner3 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">My Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  ${(order.total / 100).toFixed(2)}
                </p>
                <span
                  className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
