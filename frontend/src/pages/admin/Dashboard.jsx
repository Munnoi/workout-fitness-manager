import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, programsAPI, progressAPI, contactAPI } from '../../services/api';
import { FiUsers, FiActivity, FiMessageSquare, FiTrendingUp, FiTarget } from 'react-icons/fi';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({total_users: 0, active_users: 0, total_workouts_logged: 0, total_programs: 0, active_programs: 0, total_exercises: 0, active_enrollments: 0}); //
  const [programStats, setProgramStats] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, programsRes, progressRes, contactRes] = await Promise.all([
        usersAPI.stats(),
        programsAPI.stats(),
        progressAPI.adminStats(),
        contactAPI.stats(),
      ]);

      setUserStats(usersRes.data);
      setProgramStats(programsRes.data);
      setProgressStats(progressRes.data);
      setContactStats(contactRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">Overview of your fitness platform</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{userStats?.total_users || 0}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 transition-colors duration-200">
                  +{userStats?.new_users_this_week || 0} this week
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{userStats?.active_users || 0}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                  {progressStats?.total_workouts_logged || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                  {progressStats?.workouts_this_week || 0} this week
                </p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiActivity className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Pending Messages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{contactStats?.pending || 0}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiMessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <FiUsers className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-200">Manage Users</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-200">&rarr;</span>
              </Link>
              <Link
                to="/admin/exercises"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <FiActivity className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-200">Manage Exercises</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-200">&rarr;</span>
              </Link>
              <Link
                to="/admin/programs"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <FiTarget className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-200">Manage Programs</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 transition-colors duration-200">&rarr;</span>
              </Link>
              <Link
                to="/admin/messages"
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <FiMessageSquare className="w-5 h-5 text-primary mr-3" />
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-200">View Messages</span>
                </div>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-xs transition-colors duration-200">
                  {contactStats?.pending || 0}
                </span>
              </Link>
            </div>
          </div>

          {/* Popular Programs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Popular Programs</h2>
            {programStats?.popular_programs?.length > 0 ? (
              <div className="space-y-3">
                {programStats.popular_programs.slice(0, 5).map((program, index) => (
                  <div key={program.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs mr-3 transition-colors duration-200">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 truncate transition-colors duration-200">{program.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {program.enrollment_count} enrolled
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-200">No programs yet</p>
            )}
          </div>

          {/* Most Active Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Most Active Users</h2>
            {progressStats?.most_active_users?.length > 0 ? (
              <div className="space-y-3">
                {progressStats.most_active_users.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs mr-3 transition-colors duration-200">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 truncate transition-colors duration-200">{user.user__name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {user.workout_count} workouts
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-200">No active users yet</p>
            )}
          </div>
        </div>

        {/* Program Stats */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Program Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <p className="text-2xl font-bold text-primary transition-colors duration-200">{programStats?.total_programs || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Programs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-200">{programStats?.active_programs || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Active Programs</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">{programStats?.total_exercises || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Exercises</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-200">{programStats?.active_enrollments || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Active Enrollments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
