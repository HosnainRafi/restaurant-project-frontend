import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { connectOrdersSocket } from "@/lib/socket";
import { ImSpinner3 } from "react-icons/im";
import { useAuth } from "@/hooks/useAuth"; // 👈 1. Import the useAuth hook

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

// --- UPDATED: Frontend State Machine is now role-aware ---
const allowedNextStatus = (currentStatus, userRole) => {
  const transitions = {
    pending: ["pending", "confirmed", "cancelled"],
    confirmed: ["confirmed", "preparing", "cancelled"],
    preparing: ["preparing", "ready", "cancelled"],
    ready: ["ready", "completed", "cancelled"],
    completed: ["completed"],
    cancelled: ["cancelled"],
  };

  const options = transitions[currentStatus] || [currentStatus];

  // If the user tries to cancel an order in preparation, check their role
  // This mirrors the backend logic for a great UX.
  if (
    (currentStatus === "preparing" || currentStatus === "ready") &&
    userRole !== "manager" &&
    userRole !== "admin"
  ) {
    // If the user is not a manager/admin, remove 'cancelled' from the available options.
    return options.filter((opt) => opt !== "cancelled");
  }

  return options;
};

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // 👈 2. Get the authenticated user object

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
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      toast.success("Status updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unknown error occurred.";
      toast.error(errorMessage);
      setOrders(originalOrders);
      console.error("Failed to update status:", error.response?.data || error);
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
          {/* ... table headers ... */}
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
                    className="p-2 border rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    {/* 👇 3. Use the role-aware helper to generate the correct options */}
                    {allowedNextStatus(order.status, user?.role).map(
                      (statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.charAt(0).toUpperCase() +
                            statusOption.slice(1)}
                        </option>
                      )
                    )}
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
