import { useEffect, useState } from 'react';
import { FaBolt, FaEdit, FaStar, FaTrash, FaUtensils } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import EditMenuItemForm from '@/components/EditMenuItemForm';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { Fragment } from 'react';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get('/menu-items'),
        api.get('/menu-categories'),
      ]);
      setMenuItems(itemsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch menu data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = item => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async data => {
    if (!selectedItem) return;
    const promise = api.patch(`/menu-items/${selectedItem._id}`, data);
    toast.promise(promise, {
      loading: 'Updating item...',
      success: 'Item updated successfully!',
      error: 'Failed to update item.',
    });
    try {
      const response = await promise;
      setMenuItems(prev =>
        prev.map(item =>
          item._id === selectedItem._id ? response.data.data : item
        )
      );
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch {
      toast.error('Failed to update item.');
    }
  };

  const toggleFlag = async (id, field, value) => {
    const promise = api.patch(`/menu-items/${id}`, { [field]: value });
    toast.promise(promise, {
      loading: 'Updating...',
      success: 'Updated!',
      error: 'Failed to update.',
    });
    try {
      const res = await promise;
      setMenuItems(prev => prev.map(i => (i._id === id ? res.data.data : i)));
    } catch {
      toast.error('Failed to update item.');
    }
  };

  const handleDeleteClick = item => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const promise = api.delete(`/menu-items/${itemToDelete._id}`);
    toast.promise(promise, {
      loading: 'Deleting item...',
      success: 'Item deleted successfully!',
      error: 'Failed to delete item.',
    });
    try {
      await promise;
      setMenuItems(prev => prev.filter(i => i._id !== itemToDelete._id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch {
      toast.error('Failed to delete item.');
    }
  };

  const getCategoryName = categoryId => {
    if (!categoryId) return 'N/A';
    if (typeof categoryId === 'object' && categoryId?.name)
      return categoryId.name;
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2 md:mb-0">
            Existing Menu Items
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-500" /> Featured
            </span>
            <span className="flex items-center gap-1">
              <FaUtensils className="text-emerald-600" /> Chef's Recommendation
            </span>
            <span className="flex items-center gap-1">
              <FaBolt className="text-pink-600" /> Today's Special
            </span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading items...</p>
        ) : (
          <div className="overflow-x-auto rounded-t-xl rounded-b-xl border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-200 rounded-t-xl rounded-b-xl">
              <thead className="bg-primary/10 rounded-t-xl">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Available
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Badges
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Flags
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map(item => (
                  <tr key={item._id} className="hover:bg-primary/5 transition">
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      ${(item.price / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {item.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.isFeatured && (
                          <FaStar
                            className="text-yellow-500"
                            title="Featured"
                          />
                        )}
                        {item.isChefsRecommendation && (
                          <FaUtensils
                            className="text-emerald-600"
                            title="Chef's Recommendation"
                          />
                        )}
                        {item.isTodaysSpecial && (
                          <FaBolt
                            className="text-pink-600"
                            title="Today's Special"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!item.isFeatured}
                            onChange={e =>
                              toggleFlag(
                                item._id,
                                'isFeatured',
                                e.target.checked
                              )
                            }
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!item.isChefsRecommendation}
                            onChange={e =>
                              toggleFlag(
                                item._id,
                                'isChefsRecommendation',
                                e.target.checked
                              )
                            }
                          />
                          Chef
                        </label>
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!item.isTodaysSpecial}
                            onChange={e =>
                              toggleFlag(
                                item._id,
                                'isTodaysSpecial',
                                e.target.checked
                              )
                            }
                          />
                          Today
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Menu Item"
      >
        {selectedItem && (
          <EditMenuItemForm
            item={selectedItem}
            categories={categories}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
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
                <hr className='border border-gray-300' />
                <Dialog.Description className="text-sm text-gray-600 mt-2">
                  Are you sure you want to delete{' '}
                  <strong className='text-primary'>{itemToDelete?.name}</strong>?
                </Dialog.Description>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 transition"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    onClick={handleConfirmDelete}
                  >
                    Delete
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

export default MenuManagement;
