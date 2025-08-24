import { useState, useEffect } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import ReservationDetailsModal from '../Modal/ReservationDetailsModal';

const getStatusClass = status => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'declined':
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const CustomerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/auth/me/reservations');
        setReservations(response.data.data);
      } catch (error) {
        toast.error(error.message || 'Failed to load your reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleViewReservation = reservation => {
    setSelectedReservation(reservation);
    setIsOpen(true);
  };

  const handleCancelReservation = async reservationId => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      toast.loading('Cancelling reservation...');
      try {
        await api.patch(`/reservations/${reservationId}`, {
          status: 'Cancelled',
        });
        toast.dismiss();
        toast.success('Reservation cancelled successfully!');
        setReservations(prev =>
          prev.map(res =>
            res._id === reservationId ? { ...res, status: 'Cancelled' } : res
          )
        );
      } catch (error) {
        toast.dismiss();
        toast.error(
          error.response?.data?.message || 'Could not cancel the reservation.'
        );
      }
    }
  };

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
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Time
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Guests
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700 w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => {
                  const isCancellable =
                    res.status === 'Pending' || res.status === 'Confirmed';
                  return (
                    <tr
                      key={res._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        {new Date(res.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{res.time}</td>
                      <td className="px-4 py-3">{res.partySize}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 capitalize rounded-full text-xs font-medium ${getStatusClass(
                            res.status
                          )}`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => handleViewReservation(res)}
                          className="w-full bg-primary text-white text-sm py-1 rounded-md hover:bg-primary/90 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleCancelReservation(res._id)}
                          disabled={!isCancellable}
                          className="w-full bg-gray-200 text-gray-700 text-sm py-1 rounded-md hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <ReservationDetailsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default CustomerReservations;
