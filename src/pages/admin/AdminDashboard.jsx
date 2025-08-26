import { useState } from 'react';
import {
  FaShoppingCart,
  FaClock,
  FaHourglassHalf,
  FaTimesCircle,
  FaDollarSign,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const stats = [
  {
    icon: FaShoppingCart,
    label: 'Total Orders',
    value: '3,580',
    color: 'blue-600',
  },
  { icon: FaClock, label: 'Upcoming Orders', value: '320', color: 'green-600' },
  {
    icon: FaHourglassHalf,
    label: 'Pending Orders',
    value: '180',
    color: 'yellow-500',
  },
  {
    icon: FaTimesCircle,
    label: 'Cancelled Orders',
    value: '75',
    color: 'red-500',
  },
  {
    icon: FaDollarSign,
    label: 'Revenue',
    value: '$75,420',
    color: 'purple-600',
  },
];

const incomeData = [
  { month: 'Jan', income: 4000 },
  { month: 'Feb', income: 3000 },
  { month: 'Mar', income: 5000 },
  { month: 'Apr', income: 4500 },
  { month: 'May', income: 6000 },
  { month: 'Jun', income: 7000 },
];

const orderData = [
  {
    id: 1001,
    customer: 'John Doe',
    status: 'Completed',
    amount: '$120',
    color: 'green-600',
  },
  {
    id: 1002,
    customer: 'Sarah Lee',
    status: 'Pending',
    amount: '$85',
    color: 'yellow-600',
  },
  {
    id: 1003,
    customer: 'Michael Chen',
    status: 'Cancelled',
    amount: '$210',
    color: 'red-600',
  },
];

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition"
            >
              <div
                className={`p-3 bg-${stat.color} bg-opacity-20 text-${stat.color} rounded-full`}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <h3 className="text-lg font-semibold">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graph + Calendar */}
      <div className="grid grid-cols-3 gap-4">
        {/* Income Graph */}
        <div className="col-span-2 bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-sm font-semibold mb-2 text-center">Monthly Income</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#8B1E3F"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Calendar */}
        <div className="bg-white p-4 rounded-xl flex flex-col justify-center items-center shadow-sm">
          <h2 className="text-sm font-semibold mb-2">Calendar</h2>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            inline
          />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-sm font-semibold mb-2">Recent Orders</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-2">#</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.customer}</td>
                <td className="p-2">{order.amount}</td>
                <td className={`p-2 font-medium text-${order.color}`}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
