import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { progressAPI, programsAPI } from '../../services/api';
import { FiPlay, FiTrendingUp, FiCalendar, FiAward, FiActivity } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, todayRes, weeklyRes] = await Promise.all([
        progressAPI.stats(),
        programsAPI.today().catch(() => null),
        progressAPI.weekly(),
      ]);

      setStats(statsRes.data);
      setTodayWorkout(todayRes?.data);
      setWeeklyProgress(weeklyRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
            Lets keep the momentum going. Heres your fitness overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.total_workouts || 0}</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg transition-colors duration-200">
                <FiActivity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">This Week</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.workouts_this_week || 0}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.current_streak || 0} days</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiAward className="w-6 h-6 text-orange-600 dark:text-orange-400 transition-colors duration-200" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Completion</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.completion_percentage || 0}%</p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg transition-colors duration-200">
                <FiTrendingUp className="w-6 h-6 text-emerald-700 dark:text-emerald-400 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Workout */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Todays Workout</h2>

              {todayWorkout ? (
                <div>
                  <div className="bg-linear-to-r from-primary to-emerald-700 rounded-lg p-6 text-white mb-4">
                    <h3 className="text-lg font-semibold mb-1">
                      {todayWorkout.day?.day_name}
                    </h3>
                    <p className="text-white/80 mb-4">
                      Week {todayWorkout.enrollment?.current_week}, Day {todayWorkout.enrollment?.current_day}
                    </p>
                    <div className="flex items-center justify-between">
                      <span>{todayWorkout.day?.exercises?.length || 0} exercises</span>
                      <Link
                        to="/start-workout"
                        className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition flex items-center"
                      >
                        <FiPlay className="mr-2" />
                        Start Workout
                      </Link>
                    </div>
                  </div>

                  {todayWorkout.day?.exercises?.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors duration-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                          {item.exercise?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          {item.sets} sets x {item.reps} reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 transition-colors duration-200" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">No active workout program</p>
                  <Link
                    to="/workouts"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
                  >
                    Browse Programs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Weekly Activity</h2>

              <div className="space-y-3">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20 transition-colors duration-200">
                      {day.day_name.slice(0, 3)}
                    </span>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                        <div
                          className={`h-full rounded-full ${
                            day.workouts_completed > 0 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          style={{
                            width: `${Math.min(day.workouts_completed * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 transition-colors duration-200">
                      {day.workouts_completed}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Longest Streak</span>
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {stats?.longest_streak || 0} days
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Avg. Duration</span>
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {stats?.avg_workout_duration || 0} min
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 transition-colors duration-200">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/workouts"
                  className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition"
                >
                  Browse Workouts
                </Link>
                <Link
                  to="/progress"
                  className="block w-full text-center border border-primary text-primary dark:text-primary dark:border-primary py-2 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-200"
                >
                  View Progress
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
