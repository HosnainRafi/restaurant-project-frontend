import { useState, useEffect } from 'react';
import { ImSpinner3 } from 'react-icons/im';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching orders
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: 101,
          date: '2025-08-20',
          items: 3,
          total: 45.5,
          status: 'Delivered',
        },
        {
          id: 102,
          date: '2025-08-21',
          items: 2,
          total: 30.0,
          status: 'Pending',
        },
        {
          id: 103,
          date: '2025-08-22',
          items: 1,
          total: 15.0,
          status: 'Cancelled',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Total ($)
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{order.id}</td>
                    <td className="px-4 py-3">{order.date}</td>
                    <td className="px-4 py-3">{order.items}</td>
                    <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="w-full bg-primary text-white text-sm py-1 rounded-md hover:bg-primary/90 transition">
                        View
                      </button>
                      <button className="w-full bg-gray-200 text-gray-700 text-sm py-1 rounded-md hover:bg-gray-300 transition">
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
    </div>
  );
};

export default CustomerOrders;
