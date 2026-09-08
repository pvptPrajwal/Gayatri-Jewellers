const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const reviewCount = reviews.length;
  const rating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(rating * 10) / 10,
    reviewCount,
  });
};

// @desc    Get approved reviews for a product
// @route   GET /api/reviews?product=:productId
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { product } = req.query;
  if (!product) {
    res.status(400);
    throw new Error('product query parameter is required');
  }
  const reviews = await Review.find({ product, isApproved: true })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Create a review for a product (one per customer per product)
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  if (!product || !rating || !comment) {
    res.status(400);
    throw new Error('product, rating and comment are required');
  }

  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this product. You can edit your existing review instead.');
  }

  const review = await Review.create({ product, user: req.user._id, rating, comment });
  await recalculateProductRating(product);

  await review.populate('user', 'name');
  res.status(201).json({ success: true, review });
});

// @desc    Update your own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  if (req.body.rating) review.rating = req.body.rating;
  if (req.body.comment) review.comment = req.body.comment;
  await review.save();
  await recalculateProductRating(review.product);

  res.status(200).json({ success: true, review });
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();
  await recalculateProductRating(productId);

  res.status(200).json({ success: true, message: 'Review deleted' });
});

module.exports = { getReviews, createReview, updateReview, deleteReview };
