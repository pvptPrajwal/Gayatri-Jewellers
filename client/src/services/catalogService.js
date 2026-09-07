import api from './api';

export const fetchCategories = async (params = {}) => {
  const { data } = await api.get('/categories', { params });
  return data.categories;
};

export const fetchCollections = async (params = {}) => {
  const { data } = await api.get('/collections', { params });
  return data.collections;
};

// --- Admin: Categories ---

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data.category;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.category;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};

// --- Admin: Collections ---

export const createCollection = async (payload) => {
  const { data } = await api.post('/collections', payload);
  return data.collection;
};

export const updateCollection = async (id, payload) => {
  const { data } = await api.put(`/collections/${id}`, payload);
  return data.collection;
};

export const deleteCollection = async (id) => {
  await api.delete(`/collections/${id}`);
};
