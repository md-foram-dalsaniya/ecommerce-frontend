import { useState, useEffect } from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "../../utils/storage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formatters";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usrs = getStorage(STORAGE_KEYS.USERS) || [];
    setUsers(usrs);
    setLoading(false);
  };

  const toggleUserStatus = (user) => {
    const usrs = getStorage(STORAGE_KEYS.USERS) || [];
    const updated = usrs.map((u) =>
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    );
    setStorage(STORAGE_KEYS.USERS, updated);
    loadData();
    setSelectedUser(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Users</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt ? formatDate(user.createdAt) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${user.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                      className="text-primary-600 hover:underline mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className="text-yellow-600 hover:underline"
                    >
                      {user.isActive !== false ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <p className="text-center text-gray-500 py-8">No users yet. Users will appear when they register.</p>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
              <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedUser.phone || "-"}</p>
              <p><span className="font-medium">Joined:</span> {formatDate(selectedUser.createdAt)}</p>
              {selectedUser.addresses?.length > 0 && (
                <div>
                  <p className="font-medium">Addresses:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {selectedUser.addresses.map((a) => (
                      <li key={a.id}>{a.full}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full py-2 border rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
