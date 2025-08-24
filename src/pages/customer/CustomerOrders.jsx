import { useState, useEffect } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Helper to apply colors based on order status
const getStatusClass = status => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'preparing':
      return 'bg-blue-100 text-blue-700';
    case 'ready':
      return 'bg-cyan-100 text-cyan-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/auth/me/orders');
        const filteredOrders = response.data.data.filter(
          order => order.status?.toLowerCase() !== 'completed'
        );
        setOrders(filteredOrders);
      } catch (error) {
        toast.error('Failed to load your orders.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = orderId => {
    navigate(`/customer/dashboard/my-orders/${orderId}`);
  };

  const handlePayNow = orderId => {
    navigate(`/customer/dashboard/payment/${orderId}`);
  };

  const handleCancelOrder = order => {
    // Show modal for cancellation instructions
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
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
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
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
                    <td className="px-4 py-3">
                      {order.paymentStatus === 'unpaid' &&
                      order.status !== 'cancelled' ? (
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
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order._id)}
                        className="w-full bg-primary text-white text-sm py-1 rounded-md hover:bg-primary/90 transition px-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order)}
                        disabled={
                          order.status === 'cancelled' ||
                          order.status === 'completed'
                        }
                        className="w-full bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500 text-sm font-semibold py-1 rounded-md transition disabled:cursor-not-allowed px-3"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Modal --- */}
      {modalVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Cancel Order
            </h3>
            <p className="text-center text-gray-700 mb-4">
              To cancel this order, please contact the restaurant:
            </p>
            <p className="text-center text-blue-700 font-medium mb-6">
              1-800-RESTAURANT
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
