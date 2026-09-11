const express = require('express');
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBanners);
router.post('/', protect, authorize('ADMIN'), createBanner);
router.put('/:id', protect, authorize('ADMIN'), updateBanner);
router.delete('/:id', protect, authorize('ADMIN'), deleteBanner);

module.exports = router;
