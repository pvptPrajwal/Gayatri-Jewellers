import api from './api';

export const uploadImage = async (file, folder) => {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) formData.append('folder', folder);

  const { data } = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.image; // { url, publicId }
};

export const uploadImages = async (files, folder) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  if (folder) formData.append('folder', folder);

  const { data } = await api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.images; // [{ url, publicId }]
};

export const deleteUploadedImage = async (publicId) => {
  await api.delete('/upload', { params: { publicId } });
};
