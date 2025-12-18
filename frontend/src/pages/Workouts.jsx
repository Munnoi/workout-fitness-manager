import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { programsAPI } from '../services/api';
import { FiFilter, FiClock, FiUsers, FiTarget } from 'react-icons/fi';
import Loading from '../components/Loading';

const Workouts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    goal: searchParams.get('goal') || '',
    difficulty: searchParams.get('difficulty') || '',
    gender_focus: searchParams.get('gender_focus') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    fetchPrograms();
  }, [filters]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.goal) params.goal = filters.goal;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.gender_focus) params.gender_focus = filters.gender_focus;

      const response = await programsAPI.list(params);
      setPrograms(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({ goal: '', difficulty: '', gender_focus: '' });
    setSearchParams({});
  };

  const goalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    general_fitness: 'General Fitness',
    strength: 'Strength',
    endurance: 'Endurance',
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Workout Programs</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
              Find the perfect program for your fitness goals
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-200"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Goal
                </label>
                <select
                  value={filters.goal}
                  onChange={(e) => handleFilterChange('goal', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">All Goals</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="strength">Strength</option>
                  <option value="endurance">Endurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  For
                </label>
                <select
                  value={filters.gender_focus}
                  onChange={(e) => handleFilterChange('gender_focus', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">Everyone</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Programs Grid */}
        {loading ? (
          <Loading />
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors duration-200">No programs found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Link
                key={program.id}
                to={`/workout/${program.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                {program.image ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={program.image}
                      alt={program.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                ) : (
                  <div className="h-48 bg-linear-to-br from-primary to-emerald-700 flex items-center justify-center">
                    <FiTarget className="w-16 h-16 text-white/50 group-hover:scale-110 transition" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        difficultyColors[program.difficulty]
                      }`}
                    >
                      {program.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {program.gender_focus === 'both'
                        ? 'Everyone'
                        : program.gender_focus === 'male'
                        ? 'For Men'
                        : 'For Women'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {program.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 transition-colors duration-200">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      {program.duration_weeks} weeks
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      {program.enrollment_count || 0} enrolled
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200">
                    <span className="text-primary font-medium text-sm">
                      {goalLabels[program.goal] || program.goal}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;