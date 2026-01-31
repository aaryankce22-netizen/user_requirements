import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, role?: string) =>
    api.post('/auth/register', { name, email, password, role }),
  getMe: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Requirements API
export const requirementsAPI = {
  getAll: (projectId?: string) =>
    api.get('/requirements', { params: { project: projectId } }),
  getOne: (id: string) => api.get(`/requirements/${id}`),
  create: (data: any) => api.post('/requirements', data),
  update: (id: string, data: any) => api.put(`/requirements/${id}`, data),
  delete: (id: string) => api.delete(`/requirements/${id}`),
  addComment: (id: string, text: string) =>
    api.post(`/requirements/${id}/comments`, { text }),
};

// Assets API
export const assetsAPI = {
  getAll: (projectId?: string) =>
    api.get('/assets', { params: { project: projectId } }),
  getOne: (id: string) => api.get(`/assets/${id}`),
  upload: (formData: FormData) =>
    api.post('/assets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put(`/assets/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/assets/${id}`),
};

export default api;
