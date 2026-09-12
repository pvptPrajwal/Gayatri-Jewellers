import api from './api';

// --- Enquiries ---
export const submitEnquiry = async (payload) => {
  const { data } = await api.post('/enquiries', payload);
  return data.enquiry;
};

export const fetchEnquiries = async (params = {}) => {
  const { data } = await api.get('/enquiries', { params });
  return data; // { enquiries, total, page, pages }
};

export const updateEnquiry = async (id, payload) => {
  const { data } = await api.put(`/enquiries/${id}`, payload);
  return data.enquiry;
};

// --- Gold Rates ---
export const fetchGoldRates = async (limit) => {
  const { data } = await api.get('/gold-rates', { params: limit ? { limit } : {} });
  return data; // { current, history }
};

export const createGoldRate = async (payload) => {
  const { data } = await api.post('/gold-rates', payload);
  return data; // { rate, updatedProductsCount }
};

// --- Reviews ---
export const fetchProductReviews = async (productId) => {
  const { data } = await api.get('/reviews', { params: { product: productId } });
  return data.reviews;
};

export const submitReview = async (payload) => {
  const { data } = await api.post('/reviews', payload);
  return data.review;
};

export const deleteReview = async (id) => {
  await api.delete(`/reviews/${id}`);
};

// --- FAQs ---
export const fetchFAQs = async (params = {}) => {
  const { data } = await api.get('/faqs', { params });
  return data.faqs;
};

export const createFAQ = async (payload) => {
  const { data } = await api.post('/faqs', payload);
  return data.faq;
};

export const updateFAQ = async (id, payload) => {
  const { data } = await api.put(`/faqs/${id}`, payload);
  return data.faq;
};

export const deleteFAQ = async (id) => {
  await api.delete(`/faqs/${id}`);
};
