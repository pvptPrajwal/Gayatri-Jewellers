const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

// @desc    Get banners — active only by default, or everything for admin
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const banners = await Banner.find(filter).sort({ displayOrder: 1 });
  res.status(200).json({ success: true, count: banners.length, banners });
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  Object.assign(banner, req.body);
  await banner.save();
  res.status(200).json({ success: true, banner });
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await banner.deleteOne();
  res.status(200).json({ success: true, message: 'Banner deleted' });
});

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
