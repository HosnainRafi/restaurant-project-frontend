import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders.');
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
      loading: 'Updating order status...',
      success: 'Status updated successfully!',
      error: 'Failed to update status.',
    });

    try {
      await promise;
      fetchOrders();
    } catch (error) {
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
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-gray-800">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <p className="font-semibold">{order.customer.name}</p>
                  <p className="text-sm text-gray-400">
                    {order.customer.phone}
                  </p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={order.status}
                    onChange={e =>
                      handleUpdateStatus(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-primary focus:border-primary outline-none transition cursor-pointer"
                    disabled={
                      order.status === 'completed' ||
                      order.status === 'cancelled'
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
