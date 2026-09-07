const asyncHandler = require('express-async-handler');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const streamUpload = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ width: 1600, crop: 'limit' }] },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });

// @desc    Upload a single image (e.g. product main image, category image)
// @route   POST /api/upload/image
// @access  Private/Admin
const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503);
    throw new Error(
      'Image upload is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to server/.env.'
    );
  }
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const folder = req.body.folder || 'gayatri-jewellers/products';
  const result = await streamUpload(req.file.buffer, folder);

  res.status(201).json({
    success: true,
    image: { url: result.secure_url, publicId: result.public_id },
  });
});

// @desc    Upload multiple images (e.g. product gallery)
// @route   POST /api/upload/images
// @access  Private/Admin
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503);
    throw new Error(
      'Image upload is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to server/.env.'
    );
  }
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No image files provided');
  }

  const folder = req.body.folder || 'gayatri-jewellers/products';
  const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer, folder)));

  res.status(201).json({
    success: true,
    images: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
  });
});

// @desc    Delete an uploaded image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
// publicId may contain slashes (folder path), so it's passed as a query param instead of a URL segment
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.query;
  if (!publicId) {
    res.status(400);
    throw new Error('publicId query parameter is required');
  }
  await cloudinary.uploader.destroy(publicId);
  res.status(200).json({ success: true, message: 'Image deleted' });
});

module.exports = { uploadSingleImage, uploadMultipleImages, deleteImage };
