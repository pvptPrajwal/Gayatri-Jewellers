const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const GoldRate = require('../models/GoldRate');
const { computeFinalPrice, RATE_FIELD_MAP } = require('../utils/pricing');

// @desc    Get products with search, filters, sorting and pagination
// @route   GET /api/products
// @access  Public
// Query params supported:
//   search, category, collection, metal, purity, gender, occasion,
//   minPrice, maxPrice, minWeight, maxWeight,
//   isNewArrival, isBestSeller, isFeatured,
//   sort=featured|newest|price_asc|price_desc,
//   page, limit
const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    collection,
    metal,
    purity,
    gender,
    occasion,
    minPrice,
    maxPrice,
    minWeight,
    maxWeight,
    isNewArrival,
    isBestSeller,
    isFeatured,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (collection) query.collection = collection;
  if (metal) query.metal = metal;
  if (purity) query.purity = purity;
  if (gender) query.gender = gender;
  if (occasion) query.occasion = { $in: occasion.split(',') };
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isFeatured === 'true') query.isFeatured = true;

  if (minPrice || maxPrice) {
    query.finalPrice = {};
    if (minPrice) query.finalPrice.$gte = Number(minPrice);
    if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
  }

  if (minWeight || maxWeight) {
    query.grossWeight = {};
    if (minWeight) query.grossWeight.$gte = Number(minWeight);
    if (maxWeight) query.grossWeight.$lte = Number(maxWeight);
  }

  const sortMap = {
    featured: { isFeatured: -1, createdAt: -1 },
    newest: { createdAt: -1 },
    price_asc: { finalPrice: 1 },
    price_desc: { finalPrice: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.featured;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 60);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .populate('collection', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('collection', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, product });
});

// @desc    Get single product by slug (used for public product detail pages)
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug')
    .populate('collection', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(8)
    .select('name slug mainImage finalPrice metal purity rating');

  // Full price breakdown for the storefront's price table — recomputed
  // fresh against the current gold rate rather than trusting only the
  // stored finalPrice, so it's accurate even if this product hasn't been
  // resaved since the last rate change (bulk recalculation on rate
  // publish keeps them in sync in practice, but this guards against drift).
  let goldRate = null;
  if (product.rateType && product.rateType !== 'NONE') {
    goldRate = await GoldRate.findOne({ isCurrent: true }).sort({ date: -1 });
  }
  const priceBreakdown = computeFinalPrice(product, goldRate);
  if (goldRate && product.rateType !== 'NONE') {
    priceBreakdown.ratePerGram = goldRate[RATE_FIELD_MAP[product.rateType]] || 0;
  }

  res.status(200).json({ success: true, product, relatedProducts, priceBreakdown });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  Object.assign(product, req.body);
  product = await product.save(); // triggers pre-save hooks (finalPrice, stockStatus)

  res.status(200).json({ success: true, product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
