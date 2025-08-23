import { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import AddChefModal from '../Modal/AddChefModal';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';

const ManageChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chefToDelete, setChefToDelete] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChefs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/chefs');
      setChefs(res.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch chefs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, [refresh]);

  const refreshChefs = () => setRefresh(!refresh);

  const handleStatusChange = async (chefId, isActive) => {
    try {
      const promise = api.patch(`/chefs/${chefId}`, { isActive });
      toast.promise(promise, {
        loading: 'Updating status...',
        success: 'Status updated!',
        error: 'Failed to update status.',
      });
      await promise;
      refreshChefs();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteClick = chef => {
    setChefToDelete(chef);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chefToDelete) return;
    try {
      const promise = api.delete(`/chefs/${chefToDelete._id}`);
      toast.promise(promise, {
        loading: 'Deleting chef...',
        success: 'Chef deleted successfully!',
        error: 'Failed to delete chef.',
      });
      await promise;
      setIsDeleteModalOpen(false);
      setChefToDelete(null);
      refreshChefs();
    } catch {
      toast.error('Failed to delete chef.');
    }
  };

  const handleEditClick = chef => {
    setEditingChef(chef);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingChef(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2 md:mb-0">
            Manage Chefs
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-4 py-1.5 rounded-md"
          >
            + Add Chef
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading chefs...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Specialty
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
                {chefs.map(chef => (
                  <tr key={chef._id} className="hover:bg-primary/5 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {chef.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{chef.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {chef.specialty}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <span
                          onClick={() => handleStatusChange(chef._id, true)}
                          className={`cursor-pointer px-3 py-1 rounded-full text-white text-xs font-semibold transition ${
                            chef.isActive ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          Active
                        </span>
                        <span
                          onClick={() => handleStatusChange(chef._id, false)}
                          className={`cursor-pointer px-3 py-1 rounded-full text-white text-xs font-semibold transition ${
                            !chef.isActive ? 'bg-red-500' : 'bg-gray-300'
                          }`}
                        >
                          Inactive
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(chef)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(chef)}
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

        <AddChefModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={refreshChefs}
          chef={editingChef}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={chefToDelete?.name}
        />
      </div>
    </div>
  );
};

export default ManageChefs;
