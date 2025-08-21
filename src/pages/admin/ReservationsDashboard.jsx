import { useEffect, useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const ReservationsDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reservations');
      setReservations(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch reservations.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const promise = api.patch(`/reservations/${id}`, { status });

    toast.promise(promise, {
      loading: 'Updating status...',
      success: res => {
        setReservations(prev =>
          prev.map(r => (r._id === id ? res.data.data : r))
        );
        return `Reservation has been ${status}.`;
      },
      error: 'Failed to update status.',
    });

    try {
      await promise;
    } catch (error) {
      console.error('Failed to update reservation status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading reservations...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <h2 className="text-3xl font-bold text-primary mb-6 md:mb-10 text-center">
        Manage Reservations
      </h2>
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-primary/10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                Details
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
            {reservations.map(res => (
              <tr key={res._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {res.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{res.phone}</td>
                <td className="px-4 py-3 text-gray-600">
                  <p>Party of {res.partySize}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(res.date).toLocaleDateString()} at {res.time}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      res.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : res.status === 'declined' ||
                          res.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {res.status === 'pending' && (
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleUpdateStatus(res._id, 'approved')}
                        className="px-3 py-1 rounded-lg text-white bg-green-600 hover:bg-green-700 transition text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(res._id, 'declined')}
                        className="px-3 py-1 rounded-lg text-white bg-red-600 hover:bg-red-700 transition text-sm font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsDashboard;
