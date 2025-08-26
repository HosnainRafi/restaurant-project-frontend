import { useState } from 'react';
import { FaShoppingCart, FaDollarSign, FaHistory } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const spendData = [
  { month: 'Jan', spend: 320 },
  { month: 'Feb', spend: 450 },
  { month: 'Mar', spend: 380 },
  { month: 'Apr', spend: 500 },
  { month: 'May', spend: 420 },
  { month: 'Jun', spend: 600 },
];

const CustomerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-sm">Here’s your personalized dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-xl text-[#8B1E3F]" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
              <p className="text-xl font-bold text-gray-900">128</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <FaDollarSign className="text-xl text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Spend</h3>
              <p className="text-xl font-bold text-gray-900">$4,230</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <MdEventAvailable className="text-xl text-blue-600" />
            <div>
              <h3 className="text-sm font-medium text-gray-600">Reservations</h3>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + Spend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Spending Graph */}
        <div className="col-span-3 bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
          <h3 className="text-base text-center font-semibold text-gray-800 mb-2">📊 Spending Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="spend"
                stroke="#8B1E3F"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
                {/* Calendar */}
        <div className="col-span-2 flex justify-center flex-col items-center bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-2">📅 Calendar</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inline
            className="w-full"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaHistory className="text-[#8B1E3F]" /> Recent Activity
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-[#8B1E3F] rounded-full mt-1.5"></span>
            <p className="text-gray-600">
              Ordered <span className="font-semibold">2x Pasta Alfredo</span> on{' '}
              <span className="text-gray-800">Aug 20, 2025</span>
            </p>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></span>
            <p className="text-gray-600">
              Spent <span className="font-semibold">$56.20</span> on{' '}
              <span className="text-gray-800">Aug 15, 2025</span>
            </p>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
            <p className="text-gray-600">
              Reservation confirmed for{' '}
              <span className="font-semibold">Table 4</span> on{' '}
              <span className="text-gray-800">Aug 10, 2025</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerDashboard;
