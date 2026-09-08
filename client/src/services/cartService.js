import api from './api';

export const fetchServerCart = async () => {
  const { data } = await api.get('/cart');
  return data.items;
};

export const addServerCartItem = async (productId, quantity = 1) => {
  const { data } = await api.post('/cart', { productId, quantity });
  return data.items;
};

export const mergeServerCart = async (localItems) => {
  if (!localItems || localItems.length === 0) return fetchServerCart();
  const merge = localItems.map((i) => ({ productId: i.productId, quantity: i.quantity }));
  const { data } = await api.post('/cart', { merge });
  return data.items;
};

export const updateServerCartItem = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return data.items;
};

export const removeServerCartItem = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data.items;
};

export const clearServerCart = async () => {
  const { data } = await api.delete('/cart');
  return data.items;
};
