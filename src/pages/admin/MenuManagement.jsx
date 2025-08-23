import { useEffect, useState } from 'react';
import { FaBolt, FaEdit, FaStar, FaTrash, FaUtensils } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import EditItemModal from '../Modal/EditItemModal';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';
import AddMenuItemModal from '../Modal/AddMenuItemModal';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [refresh,setRefresh] = useState(false);

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
  }, [refresh]);
  const refreshMenu = () => {
    setRefresh(!refresh);
  };

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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            + Add Item
          </button>
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
          <EditItemModal
            item={selectedItem}
            categories={categories}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name}
      />
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refreshMenu}
      />
    </div>
  );
};

export default MenuManagement;
