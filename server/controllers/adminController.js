const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
//
// Orders, Enquiries and Gold Rate stats will be added once those models
// exist (Phase 3) — until then this reports honestly on what the store
// actually has: products, customers, catalog structure and stock health.
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCustomers,
    totalCategories,
    totalCollections,
    lowStockProducts,
    outOfStockCount,
    recentProducts,
    stockByStatus,
    productsByCategory,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'CUSTOMER' }),
    Category.countDocuments(),
    Collection.countDocuments(),
    Product.find({ stockStatus: 'LOW_STOCK', isActive: true })
      .select('name sku stockQuantity mainImage')
      .limit(10),
    Product.countDocuments({ stockStatus: 'OUT_OF_STOCK', isActive: true }),
    Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name sku finalPrice stockStatus mainImage createdAt'),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$stockStatus', count: { $sum: 1 } } },
    ]),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$category.name', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalCustomers,
      totalCategories,
      totalCollections,
      outOfStockCount,
      totalOrders: 0, // Phase 3
      totalEnquiries: 0, // Phase 3
      goldRate: null, // Phase 3
    },
    lowStockProducts,
    recentProducts,
    stockByStatus,
    productsByCategory,
  });
});

module.exports = { getDashboardStats };
