import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaPlusCircle, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import AddFoodCategoryModal from '../Modal/AddFoodCategoryModal';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';

const ManageFoodCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/menu-categories');
      setCategories(res.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const refreshCategories = () => setRefresh(!refresh);

  const handleDeleteClick = category => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const promise = api.delete(`/menu-categories/${categoryToDelete._id}`);
      toast.promise(promise, {
        loading: 'Deleting category...',
        success: 'Category deleted successfully!',
        error: 'Failed to delete category.',
      });
      await promise;
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      refreshCategories();
    } catch {
      toast.error('Failed to delete category.');
    }
  };

  const handleEditClick = category => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2 md:mb-0">
            Manage Food Categories
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-4 py-1.5 rounded-md flex items-center gap-2"
          >
            <FaPlusCircle /> Add Category
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">
            Loading categories...
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat._id} className="hover:bg-primary/5 transition">
                    <td className="px-4 py-3">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                          <FaCamera />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cat.description}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddFoodCategoryModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={refreshCategories}
          category={editingCategory}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={categoryToDelete?.name}
        />
      </div>
    </div>
  );
};

export default ManageFoodCategories;
