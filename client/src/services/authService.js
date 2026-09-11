import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data; // { token, user }
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data; // { token, user }
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
  return data;
};
