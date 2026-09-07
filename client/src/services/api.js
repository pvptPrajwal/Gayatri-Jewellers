import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach the JWT (stored in localStorage on login) to every request as a
// Bearer token. The backend also accepts an httpOnly cookie, but sending
// the header explicitly keeps things working even if cookies are blocked
// (e.g. cross-site dev setups).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rj_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default api;
