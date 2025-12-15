import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programsAPI, progressAPI } from '../services/api';
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiRepeat,
  FiBookOpen,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi';

const WorkoutSession = () => {
  const navigate = useNavigate();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exerciseStatus, setExerciseStatus] = useState({}); // {exercise_id: 'completed'/'skipped'}
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await programsAPI.today();
      setCurrentWorkout(response.data);
      // Initialize exercise status
      const initialStatus = {};
      response.data.day.exercises.forEach((ex) => {
        initialStatus[ex.id] = 'pending';
      });
      setExerciseStatus(initialStatus);
    } catch (err) {
      console.error('Error fetching today\'s workout:', err);
      setError('Failed to fetch today\'s workout. Please try again or enroll in a program.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = (exerciseId) => {
    setExerciseStatus((prev) => ({ ...prev, [exerciseId]: 'completed' }));
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

    // Construct exercise_completions list
    const exerciseCompletions = [];
    
    // Add completed and skipped exercises
    Object.entries(exerciseStatus).forEach(([exerciseId, status]) => {
      if (status === 'completed' || status === 'skipped') {
        exerciseCompletions.push({
          exercise_id: parseInt(exerciseId), 
          completed: status === 'completed',
        });
      }
    });

    try {
      await progressAPI.completeWorkout({
        program: currentWorkout.enrollment.program.id,
        day: currentWorkout.day.id,
        duration_minutes: 30, // TODO: Implement actual timer
        exercise_completions: exerciseCompletions,
      });
      setCompletionMessage('Workout completed successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error completing workout:', err);
      // Improve error display
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to complete workout. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!currentWorkout || !currentWorkout.day || currentWorkout.day.exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <FiXCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Workout Found for Today</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          It looks like you don\'t have an active workout program or no exercises scheduled for today.
          Enroll in a program to get started!
        </p>
        <button
          onClick={() => navigate('/workouts')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          Browse Programs
        </button>
      </div>
    );
  }

  const { day, enrollment } = currentWorkout;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {completionMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg flex items-center">
            <FiCheckCircle className="mr-2" />
            {completionMessage}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8 transition-colors duration-200">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
            {day.day_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">
            From: {enrollment.program_name} | Week {enrollment.current_week}, Day {enrollment.current_day}
          </p>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
            {day.exercises.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                    {item.exercise.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                      {item.sets} sets x {item.reps} reps
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                      <FiClock className="inline-block mr-1" />
                      {item.rest_time}s rest
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">
                  {item.exercise.description}
                </p>

                {item.exercise.instructions && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 transition-colors duration-200">
                    <h3 className="font-semibold text-sm mb-1 flex items-center">
                      <FiBookOpen className="mr-1" /> Instructions:
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{item.exercise.instructions}</p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleMarkComplete(item.id)}
                    disabled={exerciseStatus[item.id] === 'completed'}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 ${exerciseStatus[item.id] === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    <FiCheckCircle className="mr-2" />
                    {exerciseStatus[item.id] === 'completed' ? 'Completed!' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleMarkSkipped(item.id)}
                    disabled={exerciseStatus[item.id] === 'skipped'}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 ${exerciseStatus[item.id] === 'skipped'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FiRepeat className="mr-2" />
                    {exerciseStatus[item.id] === 'skipped' ? 'Skipped' : 'Skip'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleFinishWorkout}
            disabled={loading}
            className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Finishing...' : 'Finish Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
