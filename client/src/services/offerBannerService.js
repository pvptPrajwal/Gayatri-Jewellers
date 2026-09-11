import api from './api';

// --- Offers ---
export const fetchOffers = async (params = {}) => {
  const { data } = await api.get('/offers', { params });
  return data.offers;
};

export const createOffer = async (payload) => {
  const { data } = await api.post('/offers', payload);
  return data.offer;
};

export const updateOffer = async (id, payload) => {
  const { data } = await api.put(`/offers/${id}`, payload);
  return data.offer;
};

export const deleteOffer = async (id) => {
  await api.delete(`/offers/${id}`);
};

// --- Banners ---
export const fetchBanners = async (params = {}) => {
  const { data } = await api.get('/banners', { params });
  return data.banners;
};

export const createBanner = async (payload) => {
  const { data } = await api.post('/banners', payload);
  return data.banner;
};

export const updateBanner = async (id, payload) => {
  const { data } = await api.put(`/banners/${id}`, payload);
  return data.banner;
};

export const deleteBanner = async (id) => {
  await api.delete(`/banners/${id}`);
};
