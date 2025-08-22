import EditMenuItemForm from '@/components/EditMenuItemForm';
import Modal from '@/components/Modal';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBolt, FaEdit, FaStar, FaTrash, FaUtensils } from 'react-icons/fa';

const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const handleDeleteItem = async itemId => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const promise = api.delete(`/menu-items/${itemId}`);
    toast.promise(promise, {
      loading: 'Deleting item...',
      success: 'Item deleted successfully!',
      error: 'Failed to delete item.',
    });
    try {
      await promise;
      setMenuItems(prev => prev.filter(item => item._id !== itemId));
    } catch {
      // toast already handled
    }
  };

  const handleEditClick = item => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async data => {
    if (!selectedItem) return;

    // Example pattern to support optional new image in edit form:
    // let newImageUrl = null;
    // if (data?.imageFile instanceof File) {
    //   const uploading = uploadToImgbb(data.imageFile);
    //   toast.promise(uploading, {
    //     loading: "Uploading image...",
    //     success: "Image uploaded!",
    //     error: "Image upload failed.",
    //   });
    //   newImageUrl = await uploading;
    // }

    const payload = {
      ...data,
      // imageUrl: newImageUrl ?? data.imageUrl, // keep existing if none uploaded
    };

    const promise = api.patch(`/menu-items/${selectedItem._id}`, payload);
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
      // toast already handled
    }
  };
  // Inline toggle helper for table checkboxes
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
      // toast already handled
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
    <div>
      {/* Existing Menu Items */}
      <div className="bg-white rounded-lg shadow p-6 md:p-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-primary">
            Existing Menu Items
          </h2>
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-500" /> Featured
            </span>
            <span className="flex items-center gap-1">
              <FaUtensils className="text-emerald-600" /> Chef&apos;s
              Recommendation
            </span>
            <span className="flex items-center gap-1">
              <FaBolt className="text-pink-600" /> Today&apos;s Special
            </span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Available
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Badges
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Flags
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-800 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-semibold">
                      ${(item.price / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {item.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    {/* Badges with icons */}
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.isFeatured && (
                          <span title="Featured" className="text-yellow-500">
                            <FaStar />
                          </span>
                        )}
                        {item.isChefsRecommendation && (
                          <span
                            title="Chef's Recommendation"
                            className="text-emerald-600"
                          >
                            <FaUtensils />
                          </span>
                        )}
                        {item.isTodaysSpecial && (
                          <span
                            title="Today's Special"
                            className="text-pink-600"
                          >
                            <FaBolt />
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Inline flag toggles */}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-4">
                        <label className="flex items-center gap-1 text-xs">
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
                        <label className="flex items-center gap-1 text-xs">
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
                        <label className="flex items-center gap-1 text-xs">
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
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
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
    </div>
  );
};

export default MenuManagement;
