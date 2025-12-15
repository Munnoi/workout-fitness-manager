import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  adminLogin: (data) => api.post('/auth/admin-login/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

// Profile API
export const profileAPI = {
  get: () => api.get('/profile/'),
  update: (data) => api.patch('/profile/', data),
};

// Users API (Admin)
export const usersAPI = {
  list: (params) => api.get('/users/', { params }),
  get: (id) => api.get(`/users/${id}/`),
  update: (id, data) => api.patch(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
  block: (id) => api.patch(`/users/${id}/block/`),
  stats: () => api.get('/users/stats/'),
};

// Exercises API
export const exercisesAPI = {
  list: (params) => api.get('/exercises/', { params }),
  get: (id) => api.get(`/exercises/${id}/`),
  create: (data) => api.post('/exercises/', data),
  update: (id, data) => api.put(`/exercises/${id}/`, data),
  delete: (id) => api.delete(`/exercises/${id}/`),
};

// Programs API
export const programsAPI = {
  list: (params) => api.get('/programs/', { params }),
  get: (id) => api.get(`/programs/${id}/`),
  create: (data) => api.post('/programs/', data),
  update: (id, data) => api.put(`/programs/${id}/`, data),
  delete: (id) => api.delete(`/programs/${id}/`),
  enroll: (id) => api.post(`/programs/${id}/enroll/`),
  current: () => api.get('/programs/current/'),
  today: () => api.get('/programs/today/'),
  enrollments: () => api.get('/programs/enrollments/'),
  stats: () => api.get('/programs/stats/'),
};

// Progress API
export const progressAPI = {
  history: () => api.get('/progress/history/'),
  completeWorkout: (data) => api.post('/progress/complete-workout/', data),
  stats: () => api.get('/progress/stats/'),
  streak: () => api.get('/progress/streak/'),
  weekly: () => api.get('/progress/weekly/'),
  chart: (period) => api.get('/progress/chart/', { params: { period } }),
  adminStats: () => api.get('/progress/admin-stats/'),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact/', data),
  list: (params) => api.get('/contact/list/', { params }),
  get: (id) => api.get(`/contact/${id}/`),
  reply: (id, data) => api.patch(`/contact/${id}/reply/`, data),
  stats: () => api.get('/contact/stats/'),
};

export default api;
