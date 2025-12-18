import { useState, useEffect } from 'react';
import { programsAPI, exercisesAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import Loading from '../../components/Loading';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [exercises, setExercises] = useState([]); // To populate exercise choices in modal
  const [loading, setLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_weeks: 4,
    difficulty: 'beginner',
    gender_focus: 'both',
    goal: 'general_fitness',
    image_url: '',
    exercises: [], // This will be a list of exercise IDs
  });

  const goalLabels = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    general_fitness: 'General Fitness',
    strength: 'Strength',
    endurance: 'Endurance',
  };

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const genderFocusOptions = [
    { value: 'both', label: 'Both' },
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
  ];

  useEffect(() => {
    fetchPrograms();
    fetchExercises();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programsAPI.list();
      setPrograms(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    setExercisesLoading(true);
    try {
      const response = await exercisesAPI.list();
      setExercises(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setExercisesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleExerciseSelection = (e) => {
    const { options } = e.target;
    const selectedExercises = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedExercises.push(parseInt(options[i].value));
      }
    }
    setFormData({ ...formData, exercises: selectedExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await programsAPI.update(editingProgram.id, formData);
      } else {
        await programsAPI.create(formData);
      }
      setShowModal(false);
      setEditingProgram(null);
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description || '',
      duration_weeks: program.duration_weeks,
      difficulty: program.difficulty,
      gender_focus: program.gender_focus,
      goal: program.goal,
      image_url: program.image_url || '',
      exercises: program.exercises?.map(ex => ex.id) || [], // Safely map exercises
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await programsAPI.delete(id);
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_weeks: 4,
      difficulty: 'beginner',
      gender_focus: 'both',
      goal: 'general_fitness',
      image_url: '',
      exercises: [],
    });
  };

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Program Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">Create and manage workout programs</p>
          </div>
          <button
            onClick={() => {
              setEditingProgram(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center transition-colors duration-200"
          >
            <FiPlus className="mr-2" />
            Add Program
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 transition-colors duration-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="text-center py-12 flex justify-center">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition-colors duration-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">{program.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded text-xs capitalize transition-colors duration-200">
                    {goalLabels[program.goal] || program.goal}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs capitalize transition-colors duration-200">
                    {program.difficulty}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs capitalize transition-colors duration-200">
                    {program.gender_focus === 'both' ? 'Both' : program.gender_focus === 'male' ? 'Men' : 'Women'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {program.duration_weeks} weeks | {program.exercises?.length || 0} exercises
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                  {editingProgram ? 'Edit Program' : 'Add Program'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      name="duration_weeks"
                      value={formData.duration_weeks}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                      Difficulty
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                      Gender Focus
                    </label>
                    <select
                      name="gender_focus"
                      value={formData.gender_focus}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      {genderFocusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                      Goal
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      {Object.entries(goalLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Exercises (Select multiple)
                  </label>
                  {exercisesLoading ? (
                    <p className="text-gray-500 dark:text-gray-400">Loading exercises...</p>
                  ) : (
                    <select
                      name="exercises"
                      multiple
                      value={formData.exercises}
                      onChange={handleExerciseSelection}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 h-40"
                    >
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.muscle_group})
                        </option>
                      ))}
                    </select>
                  )}
                </div>


                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    {editingProgram ? 'Save Changes' : 'Create Program'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPrograms;
