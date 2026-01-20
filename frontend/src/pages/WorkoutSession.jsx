import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { programsAPI, progressAPI } from '../services/api';
import { FiClock, FiCheckCircle, FiXCircle, FiBookOpen, FiAlertCircle, FiPlay, FiChevronDown, FiChevronUp, FiTarget, FiAward } from 'react-icons/fi';
import Loading from '../components/Loading';
import { useState, useEffect } from 'react';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const { } = useParams();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exerciseStatus, setExerciseStatus] = useState({});
  const [completionMessage, setCompletionMessage] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await programsAPI.today();
      setCurrentWorkout(response.data);
      const initialStatus = {};
      response.data.day.exercises.forEach((ex) => {
        initialStatus[ex.id] = 'pending';
      });
      setExerciseStatus(initialStatus);
      // Auto-expand first exercise
      if (response.data.day.exercises.length > 0) {
        setExpandedExercise(response.data.day.exercises[0].id);
      }
    } catch (err) {
      console.error('Error fetching today\'s workout:', err);
      setError('Failed to fetch today\'s workout. Please try again or enroll in a program.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = (exerciseId) => {
    setExerciseStatus((prev) => ({ ...prev, [exerciseId]: 'completed' }));
    // Auto-expand next pending exercise
    const exercises = currentWorkout.day.exercises;
    const currentIndex = exercises.findIndex(ex => ex.id === exerciseId);
    const nextPending = exercises.find((ex, idx) => idx > currentIndex && exerciseStatus[ex.id] === 'pending');
    if (nextPending) {
      setExpandedExercise(nextPending.id);
    }
  };

  const handleMarkSkipped = (exerciseId) => {
    setExerciseStatus((prev) => ({ ...prev, [exerciseId]: 'skipped' }));
  };

  const handleFinishWorkout = async () => {
    setLoading(true);
    setError('');
    setCompletionMessage('');

    if (!currentWorkout || !currentWorkout.enrollment) {
      setError('No active workout to complete.');
      setLoading(false);
      return;
    }

    const exerciseCompletions = [];
    
    // Iterate over the actual exercises to map IDs correctly
    currentWorkout.day.exercises.forEach((item) => {
      const status = exerciseStatus[item.id];
      if (status === 'completed' || status === 'skipped') {
        exerciseCompletions.push({
          exercise_id: item.exercise.id,
          completed: status === 'completed',
        });
      }
    });

    try {
      await progressAPI.completeWorkout({
        program: currentWorkout.enrollment.program.id,
        day: currentWorkout.day.id,
        duration_minutes: 30,
        exercise_completions: exerciseCompletions,
      });
      setCompletionMessage('Workout completed successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error completing workout:', err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to complete workout. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress
  const getProgress = () => {
    if (!currentWorkout?.day?.exercises) return { completed: 0, total: 0, percentage: 0 };
    const total = currentWorkout.day.exercises.length;
    const completed = Object.values(exerciseStatus).filter(s => s === 'completed').length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const progress = getProgress();

  if (loading && !currentWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (error && !currentWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-6 py-4 rounded-xl flex items-center shadow-lg"
        >
          <FiAlertCircle className="mr-3 text-xl" />
          {error}
        </motion.div>
      </div>
    );
  }

  if (!currentWorkout || !currentWorkout.day || currentWorkout.day.exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiXCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Workout Found for Today</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
            It looks like you don't have an active workout program or no exercises scheduled for today.
          </p>
          <button
            onClick={() => navigate('/workouts')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse Programs
          </button>
        </motion.div>
      </div>
    );
  }

  const { day, enrollment } = currentWorkout;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Success Message */}
        <AnimatePresence>
          {completionMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-5 py-4 rounded-xl flex items-center shadow-lg"
            >
              <FiAward className="mr-3 text-2xl" />
              <span className="font-medium">{completionMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-5 py-4 rounded-xl flex items-center"
            >
              <FiAlertCircle className="mr-3 text-xl" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {day.day_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <FiTarget className="mr-2" />
                {enrollment.program_name} • Week {enrollment.current_week}, Day {enrollment.current_day}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progress.percentage}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {progress.completed} of {progress.total} exercises completed
          </p>
        </motion.div>

        {/* Exercises */}
        <div className="space-y-4">
          {day.exercises.map((item, index) => {
            const isExpanded = expandedExercise === item.id;
            const status = exerciseStatus[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  status === 'completed' ? 'ring-2 ring-green-500' :
                  status === 'skipped' ? 'ring-2 ring-gray-400 opacity-60' : ''
                }`}
              >
                {/* Exercise Header - Clickable */}
                <button
                  onClick={() => setExpandedExercise(isExpanded ? null : item.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      status === 'completed' ? 'bg-green-500' :
                      status === 'skipped' ? 'bg-gray-400' :
                      'bg-primary'
                    }`}>
                      {status === 'completed' ? <FiCheckCircle className="text-xl" /> :
                       status === 'skipped' ? <FiXCircle className="text-xl" /> :
                       index + 1}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.exercise.name}
                      </h2>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FiTarget className="mr-1" />
                          {item.sets} × {item.reps}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" />
                          {item.rest_time}s rest
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown className="text-gray-400 text-xl" />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-5 space-y-4">
                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.exercise.description}
                        </p>

                        {/* Instructions */}
                        {item.exercise.instructions && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                              <FiBookOpen className="mr-2" /> How to perform
                            </h3>
                            <p className="text-blue-700 dark:text-blue-200 text-sm whitespace-pre-wrap leading-relaxed">
                              {item.exercise.instructions}
                            </p>
                          </div>
                        )}

                        {/* YouTube Link */}
                        {item.exercise.media_url ? (
                          <a
                            href={item.exercise.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            <FiPlay className="mr-2 text-lg" />
                            Watch Video Tutorial
                          </a>
                        ) : (
                          <span className="inline-flex items-center px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm">
                            <FiPlay className="mr-2" />
                            No video available
                          </span>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={() => handleMarkComplete(item.id)}
                            disabled={status === 'completed'}
                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center font-medium transition-all duration-200 ${
                              status === 'completed'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                            }`}
                          >
                            <FiCheckCircle className="mr-2 text-lg" />
                            {status === 'completed' ? 'Completed!' : 'Mark Complete'}
                          </button>
                          <button
                            onClick={() => handleMarkSkipped(item.id)}
                            disabled={status === 'skipped'}
                            className={`py-3 px-6 rounded-xl flex items-center justify-center font-medium transition-all duration-200 ${
                              status === 'skipped'
                                ? 'bg-gray-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <FiXCircle className="mr-2" />
                            Skip
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Finish Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleFinishWorkout}
          disabled={loading || progress.completed === 0}
          className="mt-8 w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finishing...
            </>
          ) : (
            <>
              <FiAward className="mr-2 text-xl" />
              Finish Workout
            </>
          )}
        </motion.button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Complete at least one exercise to finish your workout
        </p>
      </div>
    </div>
  );
};

export default WorkoutSession;
