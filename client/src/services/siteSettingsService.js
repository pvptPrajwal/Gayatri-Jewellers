import api from './api';

export const fetchSiteSettings = async () => {
  const { data } = await api.get('/site-settings');
  return data.settings;
};

export const updateSiteSettings = async (payload) => {
  const { data } = await api.put('/site-settings', payload);
  return data.settings;
};
