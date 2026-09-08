import api from './api';

export const placeOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data.order;
};

export const fetchMyOrders = async (params = {}) => {
  const { data } = await api.get('/orders', { params });
  return data; // { orders, total, page, pages }
};

export const fetchOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
};

// --- Admin ---
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data.order;
};
