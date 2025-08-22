// src/pages/Dashboard/OrdersDashboard.jsx (or your path)

import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { connectOrdersSocket } from "@/lib/socket";
// import { connectOrdersSocket } from "../../lib/socket"; // Import the new helper

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

// Helper for enforcing valid status transitions
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

  // State for future filtering and pagination
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  // ... add more state for sorting, etc.

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Example with future-ready query params
      const response = await api.get("/orders", {
        params: {
          page,
          status: statusFilter || undefined,
        },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]); // Refetch if filters change

  // Real-time socket connection
  useEffect(() => {
    const socket = connectOrdersSocket(RESTAURANT_ID);

    socket.on("connect", () => console.log("✅ Socket connected"));

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

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    // 1. Optimistic UI update for instant feedback
    const originalOrders = [...orders];
    setOrders((currentOrders) =>
      currentOrders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    );

    // 2. API call
    try {
      const promise = api.patch(`/orders/${orderId}`, { status: newStatus });
      await toast.promise(promise, {
        loading: "Updating status...",
        success: "Status updated!",
        error: "Update failed.",
      });
      // The socket event will provide the final source of truth,
      // so no need to call fetchOrders() here.
    } catch (error) {
      // 3. Rollback on failure
      setOrders(originalOrders);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <h2 className="text-3xl font-bold text-primary mb-6 md:mb-10 text-center">
        Manage Customer Orders
      </h2>
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-primary/10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Order #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Total
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-gray-800">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <p className="font-semibold">
                    {order.customer?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {order.customer?.phone || "N/A"}
                  </p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-primary focus:border-primary outline-none transition cursor-pointer"
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    {[
                      "pending",
                      "confirmed",
                      "preparing",
                      "ready",
                      "completed",
                      "cancelled",
                    ].map((statusOption) => (
                      <option
                        key={statusOption}
                        value={statusOption}
                        disabled={
                          !allowedNextStatus(order.status).includes(
                            statusOption
                          )
                        }
                      >
                        {statusOption.charAt(0).toUpperCase() +
                          statusOption.slice(1)}
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
