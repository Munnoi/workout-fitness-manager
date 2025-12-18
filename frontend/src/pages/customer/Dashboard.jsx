import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { programsAPI, progressAPI } from '../../services/api';
import { FiActivity, FiTarget, FiTrendingUp, FiCalendar, FiAward, FiPlay, FiClock } from 'react-icons/fi';
import Loading from '../../components/Loading';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
            Let's keep the momentum going. Here's your fitness overview.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Workouts', value: stats?.total_workouts || 0, icon: <FiActivity />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            { label: 'This Week', value: stats?.workouts_this_week || 0, icon: <FiCalendar />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
            { label: 'Current Streak', value: `${stats?.current_streak || 0} days`, icon: <FiAward />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
            { label: 'Completion', value: `${stats?.completion_percentage || 0}%`, icon: <FiTrendingUp />, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 transition-colors duration-200">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors duration-200`}>
                  <div className="w-6 h-6">{stat.icon}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Workout */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200 h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">Today's Workout</h2>

              {todayWorkout ? (
                <div>
                  <div className="relative overflow-hidden rounded-2xl p-8 mb-6 text-white shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700 z-0 transition-transform duration-500 group-hover:scale-105"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {todayWorkout.day?.day_name}
                          </h3>
                          <p className="text-white/90 font-medium">
                            Week {todayWorkout.enrollment?.current_week} • Day {todayWorkout.enrollment?.current_day}
                          </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                          <FiTarget className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center space-x-4 text-sm text-white/90">
                          <span className="flex items-center"><FiActivity className="mr-1" /> {todayWorkout.day?.exercises?.length || 0} Exercises</span>
                          <span className="flex items-center"><FiClock className="mr-1" /> ~45 Min</span>
                        </div>
                        <Link
                          to="/start-workout"
                          className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center"
                        >
                          <FiPlay className="mr-2 fill-current" />
                          Start Now
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Up Next</h4>
                    {todayWorkout.day?.exercises?.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center font-bold text-sm mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                              {item.exercise?.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                              {item.sets} sets × {item.reps} reps
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {todayWorkout.day?.exercises?.length > 3 && (
                      <p className="text-center text-sm text-gray-500 mt-2">
                        + {todayWorkout.day.exercises.length - 3} more exercises
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                    <FiCalendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium mb-1">No active workout today</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Take a rest day or browse programs to start a new one.</p>
                  <Link
                    to="/workouts"
                    className="inline-flex items-center bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition font-medium shadow-md hover:shadow-lg"
                  >
                    Browse Programs
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Weekly Progress & Actions */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Weekly Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">Weekly Activity</h2>

              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 transition-colors duration-200">
                      {day.day_name.slice(0, 3)}
                    </span>
                    <div className="flex-1 mx-3 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(day.workouts_completed * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          day.workouts_completed > 0 
                            ? 'bg-gradient-to-r from-primary to-purple-500' 
                            : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <span className={`text-sm font-bold w-4 text-right transition-colors duration-200 ${
                      day.workouts_completed > 0 ? 'text-primary' : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {day.workouts_completed}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Longest Streak</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.longest_streak || 0} <span className="text-xs font-normal text-gray-500">days</span></p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Avg. Duration</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.avg_workout_duration || 0} <span className="text-xs font-normal text-gray-500">min</span></p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/workouts"
                  className="block w-full text-center bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Browse All Workouts
                </Link>
                <Link
                  to="/progress"
                  className="block w-full text-center border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all"
                >
                  View Full Progress
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-center text-primary text-sm font-medium hover:underline mt-2"
                >
                  Manage Profile Settings
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
