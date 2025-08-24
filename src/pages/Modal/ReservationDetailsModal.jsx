import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

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

const ReservationDetailsModal = ({ isOpen, setIsOpen, reservation }) => {
  if (!reservation) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
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
            <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <Dialog.Title className="text-md font-semibold text-gray-800">
                  Reservation Details
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 rounded-full bg-primary text-white hover:bg-primary/90 transition text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Customer</p>
                  <p className="text-gray-900">{reservation.customer?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900">{reservation.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Date</p>
                  <p className="text-gray-900">
                    {new Date(reservation.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Time</p>
                  <p className="text-gray-900">{reservation.time}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Guests</p>
                  <p className="text-gray-900">{reservation.partySize}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Source</p>
                  <p className="text-gray-900">{reservation.source}</p>
                </div>
                {reservation.note && (
                  <div className="col-span-2">
                    <p className="text-gray-500 font-medium">Note</p>
                    <p className="text-gray-900">{reservation.note}</p>
                  </div>
                )}
                <div className="col-span-2 flex items-center gap-2">
                  <p className="text-gray-500 font-medium">Status:</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t px-6 py-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReservationDetailsModal;
