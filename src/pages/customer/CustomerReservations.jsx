import { useState, useEffect } from 'react';
import { ImSpinner3 } from 'react-icons/im';

const CustomerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching reservations
  useEffect(() => {
    setTimeout(() => {
      setReservations([
        {
          id: 1,
          date: '2025-08-25',
          time: '7:00 PM',
          guests: 2,
          status: 'Confirmed',
        },
        {
          id: 2,
          date: '2025-08-26',
          time: '8:30 PM',
          guests: 4,
          status: 'Pending',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        My Reservations
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <ImSpinner3 className="animate-spin text-primary text-3xl" />
          </div>
        ) : reservations.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You have no reservations yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Time
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Guests
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700 w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr
                    key={res.id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{res.date}</td>
                    <td className="px-4 py-3">{res.time}</td>
                    <td className="px-4 py-3">{res.guests}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          res.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : res.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {res.status}
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

export default CustomerReservations;
