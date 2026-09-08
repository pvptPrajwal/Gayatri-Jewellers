const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Order = require('../models/Order');
const Enquiry = require('../models/Enquiry');
const GoldRate = require('../models/GoldRate');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
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
    totalOrders,
    pendingOrders,
    recentOrders,
    totalEnquiries,
    newEnquiries,
    recentEnquiries,
    currentGoldRate,
    revenueAgg,
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
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } }),
    Order.find().populate('user', 'name').sort({ createdAt: -1 }).limit(5).select('orderNumber totalPrice status user createdAt'),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: 'NEW' }),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt'),
    GoldRate.findOne({ isCurrent: true }).sort({ date: -1 }),
    Order.aggregate([
      { $match: { status: { $ne: 'PENDING' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
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
      totalOrders,
      pendingOrders,
      totalEnquiries,
      newEnquiries,
      goldRate: currentGoldRate,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
    lowStockProducts,
    recentProducts,
    recentOrders,
    recentEnquiries,
    stockByStatus,
    productsByCategory,
  });
});

module.exports = { getDashboardStats };
