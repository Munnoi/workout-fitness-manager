import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../../services/api';
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit2,
  FiSave,
  FiX,
} from 'react-icons/fi';
import Loading from '../../components/Loading';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    fitness_goal: 'general_fitness',
    experience_level: 'beginner',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.is_active = filter === 'active';
      const response = await usersAPI.list(params);
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      age: user.age || '',
      gender: user.gender || '',
      fitness_goal: user.fitness_goal || 'general_fitness',
      experience_level: user.experience_level || 'beginner',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...editForm,
        age: editForm.age === '' ? null : Number(editForm.age),
      };

      const response = await usersAPI.update(selectedUser.id, payload);
      const updatedUser = response.data;

      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
      setSelectedUser((prev) => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setSuccess('User details updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      const apiError = err.response?.data;
      if (apiError && typeof apiError === 'object') {
        const firstKey = Object.keys(apiError)[0];
        const firstValue = apiError[firstKey];
        setError(Array.isArray(firstValue) ? firstValue[0] : firstValue);
      } else {
        setError('Failed to update user details');
      }
      setTimeout(() => setError(''), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleBlock = async (userId) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return;

    const originalUser = users[userIndex];
    const updatedUser = { ...originalUser, is_active: !originalUser.is_active };

    const newUsers = [...users];
    newUsers[userIndex] = updatedUser;
    setUsers(newUsers);

    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => ({ ...prev, is_active: updatedUser.is_active }));
    }

    try {
      await usersAPI.block(userId);
      setSuccess(`User ${updatedUser.is_active ? 'unblocked' : 'blocked'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error blocking user:', err);
      setError('Failed to update user status');
      newUsers[userIndex] = originalUser;
      setUsers([...newUsers]);
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, is_active: originalUser.is_active }));
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const previousUsers = [...users];
    setUsers(users.filter((u) => u.id !== userId));
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
      setIsEditing(false);
    }

    try {
      await usersAPI.delete(userId);
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      setUsers(previousUsers);
      setTimeout(() => setError(''), 3000);
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
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">View, track, and edit user accounts</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center transition-colors duration-200">
            <FiCheckCircle className="mr-2" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg flex items-center transition-colors duration-200">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

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
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Users ({filteredUsers.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center h-64 flex items-center justify-center">
                <Loading />
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
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Enrolled: {user.enrolled_workouts || 0} | Completed: {user.completed_workouts || 0}
                        </p>
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
                        <button
                          onClick={(e) => handleDelete(user.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          title="Delete User"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.enrolled_workouts || 0}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.active_enrollments || 0}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.completed_workouts || 0}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3 mb-6">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Full name"
                    />
                    <input
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Email"
                    />
                    <input
                      name="age"
                      type="number"
                      min="1"
                      value={editForm.age}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Age"
                    />
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <select
                      name="fitness_goal"
                      value={editForm.fitness_goal}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="general_fitness">General Fitness</option>
                    </select>
                    <select
                      name="experience_level"
                      value={editForm.experience_level}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Gender</span>
                      <span className="text-gray-900 dark:text-white capitalize">{selectedUser.gender || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Age</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.age || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Goal</span>
                      <span className="text-gray-900 dark:text-white capitalize">{selectedUser.fitness_goal?.replace('_', ' ') || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Level</span>
                      <span className="text-gray-900 dark:text-white capitalize">{selectedUser.experience_level || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Joined</span>
                      <span className="text-gray-900 dark:text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Login</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveUser}
                        disabled={saving}
                        className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-60"
                      >
                        <FiSave className="mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                    >
                      <FiEdit2 className="mr-2" />
                      Edit Details
                    </button>
                  )}

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

export default Users;

