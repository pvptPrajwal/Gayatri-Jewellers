import api from './api';

// params: search, category, collection, metal, purity, gender, occasion,
// minPrice, maxPrice, minWeight, maxWeight, isNewArrival, isBestSeller,
// isFeatured, sort, page, limit
export const fetchProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data; // { products, total, page, pages, count }
};

export const fetchProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/slug/${slug}`);
  return data; // { product, relatedProducts, priceBreakdown }
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
};

// --- Admin ---

export const createProduct = async (payload) => {
  const { data } = await api.post('/products', payload);
  return data.product;
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.product;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};
