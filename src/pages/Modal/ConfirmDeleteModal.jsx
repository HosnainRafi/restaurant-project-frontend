import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        {/* Modal Panel */}
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
            <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm mx-auto shadow-lg">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Confirm Delete
              </Dialog.Title>
              <hr className="border border-gray-300 mt-2" />
              <Dialog.Description className="text-sm text-gray-600 mt-3">
                Are you sure you want to delete{' '}
                <strong className="text-primary">{itemName}</strong>?
              </Dialog.Description>

              {/* Actions */}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                  onClick={onConfirm}
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmDeleteModal;
