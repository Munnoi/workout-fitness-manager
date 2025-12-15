import { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiActivity, FiTrendingUp, FiAward, FiClock, FiCalendar } from 'react-icons/fi';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [period]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const [statsRes, historyRes, chartRes] = await Promise.all([
        progressAPI.stats(),
        progressAPI.history(),
        progressAPI.chart(period),
      ]);

      setStats(statsRes.data);
      setHistory(historyRes.data.results || historyRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Your Progress</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">Track your fitness journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.total_workouts || 0}</p>
              </div>
              <FiActivity className="w-8 h-8 text-primary transition-colors duration-200" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.current_streak || 0} days</p>
              </div>
              <FiAward className="w-8 h-8 text-orange-500 transition-colors duration-200" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{stats?.workouts_this_month || 0}</p>
              </div>
              <FiCalendar className="w-8 h-8 text-green-500 transition-colors duration-200" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                  {Math.round((stats?.total_duration_minutes || 0) / 60)}h
                </p>
              </div>
              <FiClock className="w-8 h-8 text-emerald-600 dark:text-emerald-500 transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Workout Activity</h2>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                    period === p
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="#9ca3af"
                    className="text-gray-400 dark:text-gray-500"
                  />
                  <YAxis stroke="#9ca3af" className="text-gray-400 dark:text-gray-500" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-bg-tooltip)',
                      border: '1px solid var(--color-border-tooltip)',
                      borderRadius: '8px',
                      color: 'var(--color-text-tooltip)'
                    }}
                    wrapperClassName="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e' }}
                    name="Duration (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
              No workout data available for this period
            </div>
          )}
        </div>

        {/* Workout History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Workout History</h2>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              {history.map((workout) => (
                <div key={workout.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                        {workout.day_name || workout.program_name || 'Workout'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {new Date(workout.completed_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      {workout.duration_minutes && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                          {workout.duration_minutes} min
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {workout.exercise_completions?.length || 0} exercises
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <FiTrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600 transition-colors duration-200" />
              <p>No workouts completed yet</p>
              <p className="text-sm mt-1">Start a workout to see your progress here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
