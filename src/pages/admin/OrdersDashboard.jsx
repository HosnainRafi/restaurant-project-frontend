import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { connectOrdersSocket } from "@/lib/socket";
import { ImSpinner3 } from "react-icons/im";

// This should come from your auth context in a real app
const RESTAURANT_ID = "68a6a96187ed6561f8380f53";

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
      return "bg-primary/20 text-primary";
  }
};

// Helper for enforcing valid status transitions on the frontend (optional but good UX)
const allowedNextStatus = (currentStatus) => {
  const transitions = {
    pending: ["pending", "confirmed", "cancelled"],
    confirmed: ["confirmed", "preparing", "cancelled"],
    preparing: ["preparing", "ready", "cancelled"],
    ready: ["ready", "completed", "cancelled"],
    completed: ["completed"],
    cancelled: ["cancelled"],
  };
  return transitions[currentStatus] || [currentStatus];
};

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = connectOrdersSocket(RESTAURANT_ID);
    socket.on("connect", () => console.log("✅ Socket connected for orders"));

    socket.on("order:created", (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      toast.success(`New Order #${newOrder.orderNumber}`);
    });

    socket.on("order:updated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    setOrders((currentOrders) =>
      currentOrders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    );

    try {
      const promise = api.patch(`/orders/${orderId}`, { status: newStatus });
      await toast.promise(promise, {
        loading: "Updating status...",
        success: "Status updated!",
        error: "Update failed.",
      });
    } catch (error) {
      setOrders(originalOrders);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ImSpinner3 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Live Orders Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              {/* --- NEW COLUMN HEADER --- */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                  ${(order.total / 100).toFixed(2)}
                </td>

                {/* --- NEW TABLE CELL FOR PAYMENT STATUS --- */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    className="p-2 border rounded-md bg-white"
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    {allowedNextStatus(order.status).map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersDashboard;
