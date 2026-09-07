const express = require('express');
const { uploadSingleImage, uploadMultipleImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/image', protect, authorize('ADMIN'), upload.single('image'), uploadSingleImage);
router.post('/images', protect, authorize('ADMIN'), upload.array('images', 6), uploadMultipleImages);
router.delete('/', protect, authorize('ADMIN'), deleteImage);

module.exports = router;
