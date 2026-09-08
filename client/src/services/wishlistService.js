import api from './api';

export const fetchServerWishlist = async () => {
  const { data } = await api.get('/wishlist');
  return data.items;
};

export const addServerWishlistItem = async (productId) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data.items;
};

export const mergeServerWishlist = async (localProductIds) => {
  if (!localProductIds || localProductIds.length === 0) return fetchServerWishlist();
  // any productId works as the URL param here since the body's merge array drives the actual merge
  const { data } = await api.post(`/wishlist/${localProductIds[0]}`, { merge: localProductIds });
  return data.items;
};

export const removeServerWishlistItem = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data.items;
};
