import { useState, useEffect, Fragment } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { Dialog, Transition } from '@headlessui/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Helper to apply colors based on reservation status
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
        toast.error('Failed to load your reservations.');
        console.error(error);
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
      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    Reservation Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                {selectedReservation && (
                  <div className="px-6 py-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Customer</p>
                      <p className="text-gray-900">
                        {selectedReservation.customer?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900">
                        {selectedReservation.customer?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Date</p>
                      <p className="text-gray-900">
                        {new Date(
                          selectedReservation.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Time</p>
                      <p className="text-gray-900">
                        {selectedReservation.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Guests</p>
                      <p className="text-gray-900">
                        {selectedReservation.partySize}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Source</p>
                      <p className="text-gray-900">
                        {selectedReservation.source}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">Note</p>
                      <p className="text-gray-900">
                        {selectedReservation.note || 'No notes'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">Status</p>
                      <span
                        className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusClass(
                          selectedReservation.status
                        )}`}
                      >
                        {selectedReservation.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-end border-t px-6 py-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CustomerReservations;
