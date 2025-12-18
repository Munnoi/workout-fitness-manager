import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { programsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FiClock,
  FiUsers,
  FiTarget,
  FiCalendar,
  FiPlay,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiVideo,
} from 'react-icons/fi';
import Loading from '../components/Loading';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(1);

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      const response = await programsAPI.get(id);
      setProgram(response.data);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/workout/${id}` } } });
      return;
    }

    setEnrolling(true);
    try {
      await programsAPI.enroll(id);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const groupDaysByWeek = (days) => {
    const weeks = {};
    days?.forEach((day) => {
      if (!weeks[day.week_number]) {
        weeks[day.week_number] = [];
      }
      weeks[day.week_number].push(day);
    });
    return weeks;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Program not found</p>
      </div>
    );
  }

  const weeklyDays = groupDaysByWeek(program.days);

  const goalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    general_fitness: 'General Fitness',
    strength: 'Strength',
    endurance: 'Endurance',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div
        className={`relative text-white py-16 ${
          !program.image ? 'bg-linear-to-br from-primary to-emerald-800' : ''
        }`}
        style={
          program.image
            ? {
                backgroundImage: `url('${program.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}
        }
      >
        {program.image && <div className="absolute inset-0 bg-black/60"></div>}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {program.difficulty}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {goalLabels[program.goal]}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{program.name}</h1>
              <p className="text-xl text-white/80 max-w-2xl">{program.description}</p>
            </div>
            <div className="flex-shrink-0 flex gap-4">
              {program.media_url && (
                <a
                  href={program.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition flex items-center"
                >
                  <FiVideo className="mr-2" />
                  Watch Intro
                </a>
              )}
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition flex items-center disabled:opacity-50"
              >
                <FiPlay className="mr-2" />
                {enrolling ? 'Enrolling...' : 'Start Program'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Program Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center transition-colors duration-200">
            <FiClock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{program.duration_weeks}</p>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Weeks</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center transition-colors duration-200">
            <FiCalendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{program.days_per_week}</p>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Days/Week</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center transition-colors duration-200">
            <FiTarget className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{program.total_exercises || 0}</p>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Exercises</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center transition-colors duration-200">
            <FiUsers className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{program.enrollment_count || 0}</p>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Enrolled</p>
          </div>
        </div>

        {/* Program Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Program Schedule</h2>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">View the complete workout plan</p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
            {Object.entries(weeklyDays).map(([weekNum, days]) => (
              <div key={weekNum}>
                <button
                  onClick={() => setExpandedWeek(expandedWeek === parseInt(weekNum) ? null : parseInt(weekNum))}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-4">
                      {weekNum}
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                      Week {weekNum}
                    </span>
                    <span className="ml-4 text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {days.length} workout{days.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {expandedWeek === parseInt(weekNum) ? (
                    <FiChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-200" />
                  )}
                </button>

                {expandedWeek === parseInt(weekNum) && (
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      {days.map((day) => (
                        <div
                          key={day.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                              {day.day_name}
                            </h4>
                            {day.is_rest_day && (
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-sm transition-colors duration-200">
                                Rest Day
                              </span>
                            )}
                          </div>
                          {day.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-200">
                              {day.description}
                            </p>
                          )}
                          {!day.is_rest_day && day.exercises?.length > 0 && (
                            <div className="space-y-2">
                              {day.exercises.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-700 first:border-0 transition-colors duration-200"
                                >
                                  <div className="flex items-center">
                                    <span className="w-6 h-6 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs mr-3 transition-colors duration-200">
                                      {idx + 1}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                      {item.exercise?.name}
                                    </span>
                                    {item.exercise?.media_url && (
                                      <a
                                        href={item.exercise.media_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Watch Video"
                                      >
                                        <FiVideo />
                                      </a>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                    {item.sets} x {item.reps}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-primary text-white px-12 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition inline-flex items-center disabled:opacity-50"
          >
            <FiPlay className="mr-2" />
            {enrolling ? 'Enrolling...' : 'Start This Program'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
