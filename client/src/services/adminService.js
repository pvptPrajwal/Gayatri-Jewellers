import api from './api';

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data; // { stats, lowStockProducts, recentProducts, stockByStatus, productsByCategory }
};

export const fetchUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  return data; // { users, total, page, pages }
};

export const updateUserStatus = async (id, isActive) => {
  const { data } = await api.put(`/users/${id}/status`, { isActive });
  return data.user;
};
