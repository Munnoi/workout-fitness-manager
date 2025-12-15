import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { FiSearch, FiUserX, FiUserCheck, FiTrash2, FiEye } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.is_active = filter === 'active';
      const response = await usersAPI.list(params);
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await usersAPI.block(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(userId);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">User Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">View and manage user accounts</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 transition-colors duration-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <option value="">All Users</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Users ({filteredUsers.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">No users found</div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                      selectedUser?.id === user.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                            user.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Blocked'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">User Details</h2>
            </div>

            {selectedUser ? (
              <div className="p-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
                    <span className="text-2xl font-bold text-primary transition-colors duration-200">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{selectedUser.email}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Gender</span>
                    <span className="text-gray-900 dark:text-white capitalize transition-colors duration-200">
                      {selectedUser.gender || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Age</span>
                    <span className="text-gray-900 dark:text-white transition-colors duration-200">{selectedUser.age || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Goal</span>
                    <span className="text-gray-900 dark:text-white capitalize transition-colors duration-200">
                      {selectedUser.fitness_goal?.replace('_', ' ') || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Level</span>
                    <span className="text-gray-900 dark:text-white capitalize transition-colors duration-200">
                      {selectedUser.experience_level || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Joined</span>
                    <span className="text-gray-900 dark:text-white transition-colors duration-200">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Last Login</span>
                    <span className="text-gray-900 dark:text-white transition-colors duration-200">
                      {selectedUser.last_login
                        ? new Date(selectedUser.last_login).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleBlock(selectedUser.id)}
                    className={`w-full flex items-center justify-center py-2 px-4 rounded-lg transition-colors duration-200 ${
                      selectedUser.is_active
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                    }`}
                  >
                    {selectedUser.is_active ? (
                      <>
                        <FiUserX className="mr-2" />
                        Block User
                      </>
                    ) : (
                      <>
                        <FiUserCheck className="mr-2" />
                        Unblock User
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedUser.id)}
                    className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete User
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <FiEye className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600 transition-colors duration-200" />
                <p>Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
