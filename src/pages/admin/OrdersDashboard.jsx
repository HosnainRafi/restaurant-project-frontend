import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const promise = api.patch(`/orders/${orderId}`, { status: newStatus });
    toast.promise(promise, {
      loading: "Updating order status...",
      success: "Status updated successfully!",
      error: "Failed to update status.",
    });
    try {
      await promise;
      // Refetch all orders to get the latest state
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Customer Orders</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Order #
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Customer
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Total
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-center">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-5 py-4 font-mono text-sm">
                  {order.orderNumber}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">
                    {order.customer.phone}
                  </p>
                </td>
                <td className="px-5 py-4 font-semibold">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      order.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-200 text-red-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {/* Dropdown to change status */}
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded p-1"
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
