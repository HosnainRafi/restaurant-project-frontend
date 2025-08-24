import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ImSpinner3 } from 'react-icons/im';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { io } from 'socket.io-client';
import OrderStatusTracker from '@/components/OrderStatusTracker';

const getStatusClass = status => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'preparing':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
      return 'bg-cyan-100 text-cyan-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/auth/me/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error(error.message || 'Could not load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();

    if (user?.uid) {
      const socket = io(import.meta.env.VITE_API_BASE_URL);
      socket.emit('join_room', `user:${user.uid}`);
      socket.on('order:updated', updatedOrder => {
        if (updatedOrder._id === orderId) {
          setOrder(updatedOrder);
          toast.success(`Your order is now ${updatedOrder.status}!`);
        }
      });
      return () => socket.disconnect();
    }
  }, [orderId, user]);

  const handlePayNow = () => navigate(`/customer/dashboard/payment/${orderId}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <ImSpinner3 className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link
          to="/dashboard/my-orders"
          className="mt-4 inline-block bg-primary text-white py-2 px-5 rounded-full hover:bg-primary/90 transition"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const isPayable =
    order.paymentStatus === 'unpaid' && order.status !== 'cancelled';

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Status Tracker */}
        <OrderStatusTracker currentStatus={order.status} />

        {/* Order Card */}
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Order #{order.orderNumber}
              </h2>
              <p className="text-gray-500 text-sm">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 capitalize rounded-full text-sm font-medium ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Items & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
            {/* Items */}
            <div>
              <h3 className="font-semibold mb-2 border-b pb-1">
                Items Ordered
              </h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.menuItemId} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-2 border-b pb-1">Summary</h3>
              <div className="space-y-1">
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
                <div className="flex justify-between font-bold border-t pt-1 mt-1">
                  <span>Total:</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span>Payment:</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pay Now */}
          {isPayable && (
            <div className="mt-4 pt-3 border-t text-center">
              <button
                onClick={handlePayNow}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-md transition-colors text-sm"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-end">
          <Link
            to="/customer/dashboard/my-orders"
            className="bg-white border border-gray-300 hover:border-primary hover:text-primary text-gray-700 font-semibold py-2 px-4 rounded-md transition-colors shadow-sm text-sm"
          >
            ← Back to All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
