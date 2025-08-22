import { useState } from 'react';
import { FaBan, FaUnlock } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Asadul Islam',
      email: 'asad@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'User',
      status: 'Blocked',
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'Active',
    },
  ]);

  const toggleStatus = id => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' }
          : user
      )
    );
  };

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
                key={user.id}
                className={`${
                  idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600 truncate">
                  {user.email}
                </td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center w-36">
                  {user.status === 'Active' ? (
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full"
                    >
                      <FaBan size={12} /> Block
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleStatus(user.id)}
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
