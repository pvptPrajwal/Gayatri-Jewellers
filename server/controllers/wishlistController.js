const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name slug mainImage finalPrice metal purity isActive'
  );
  const items = user.wishlist.filter((p) => p && p.isActive);
  res.status(200).json({ success: true, items });
});

// @desc    Add a product to wishlist (also accepts `merge` array of productIds for guest-cart merge on login)
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { merge } = req.body || {};

  const user = await User.findById(req.user._id);
  const idsToAdd = Array.isArray(merge) && merge.length > 0 ? merge : [productId];

  idsToAdd.forEach((id) => {
    if (id && !user.wishlist.some((w) => w.toString() === id)) {
      user.wishlist.push(id);
    }
  });

  await user.save();
  await user.populate('wishlist', 'name slug mainImage finalPrice metal purity isActive');
  res.status(200).json({ success: true, items: user.wishlist.filter((p) => p && p.isActive) });
});

// @desc    Remove a product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  await user.populate('wishlist', 'name slug mainImage finalPrice metal purity isActive');
  res.status(200).json({ success: true, items: user.wishlist.filter((p) => p && p.isActive) });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
