import { useEffect, useState } from 'react';
import { FaBan, FaUnlock } from 'react-icons/fa';
// Import your configured api client
import api from '@/lib/api';

const ManageUsers = () => {
  // State for storing users, loading status, and errors
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- UPDATED: Simplified API call ---
        // Your api client automatically adds the base URL and auth token.
        const response = await api.get('/auth');

        // The user list is inside response.data.data
        if (response.data && response.data.success) {
          setUsers(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // The empty array [] means this effect runs only once on mount

  // Update the status change function to call the API
  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';

    try {
      // --- UPDATED: Simplified API call ---
      // The base URL and auth headers are handled by your api client.
      const response = await api.patch(
        `/auth/${userId}/status`, // The endpoint relative to your baseURL
        { status: newStatus }      // The request body
      );

      // If the API call is successful, update the state locally
      if (response.data && response.data.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, status: newStatus } : user,
          ),
        );
      }
    } catch (err) {
      alert('Failed to update user status. Please try again.');
      console.error('Update status error:', err);
    }
  };

  // UI for loading and error states
  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-primary mb-6">Manage Users</h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead>
            <tr className="bg-primary text-white text-left">
              <th className="px-4 py-3 rounded-tl-xl">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 rounded-tr-xl text-center w-32">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600 truncate">
                  {user.email}
                </td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() +
                      user.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center w-36">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => toggleStatus(user._id, user.status)}
                      // --- ADD THIS LINE: Disable button if the user's role is 'admin' ---
                      disabled={user.role === 'admin'}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FaBan size={12} /> Block
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleStatus(user._id, user.status)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition w-full"
                    >
                      <FaUnlock size={12} /> Unblock
                    </button>
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

export default ManageUsers;