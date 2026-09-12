const asyncHandler = require('express-async-handler');
const GoldRate = require('../models/GoldRate');
const Product = require('../models/Product');
const { computeFinalPrice } = require('../utils/pricing');

// Recalculates finalPrice for every product linked to a live gold/silver
// rate (rateType !== 'NONE'), using the given GoldRate document. Products
// priced manually (rateType: 'NONE') are untouched — their Rate comes from
// basePrice, not the gold rate. Margin type/value and GST on each product
// are left exactly as saved; only finalPrice changes.
const recalculateRateLinkedProducts = async (goldRate) => {
  const products = await Product.find({ rateType: { $ne: 'NONE' } }).select(
    'rateType grossWeight basePrice marginType marginValue gstPercent'
  );

  if (products.length === 0) return 0;

  const bulkOps = products.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: { $set: { finalPrice: computeFinalPrice(product, goldRate).finalPrice } },
    },
  }));

  await Product.bulkWrite(bulkOps);
  return products.length;
};

// @desc    Get current rate + recent history
// @route   GET /api/gold-rates
// @access  Public
const getGoldRates = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);

  const [current, history] = await Promise.all([
    GoldRate.findOne({ isCurrent: true }).sort({ date: -1 }),
    GoldRate.find().sort({ date: -1 }).limit(limit),
  ]);

  res.status(200).json({ success: true, current: current || history[0] || null, history });
});

// @desc    Add a new gold rate entry — becomes the current rate, and every
//          rate-linked product's price is recalculated against it
// @route   POST /api/gold-rates
// @access  Private/Admin
const createGoldRate = asyncHandler(async (req, res) => {
  const { rate24k, rate22k, rate18k, silverRate, date } = req.body;

  if ([rate24k, rate22k, rate18k, silverRate].some((v) => v === undefined || v === null)) {
    res.status(400);
    throw new Error('rate24k, rate22k, rate18k and silverRate are all required');
  }

  await GoldRate.updateMany({ isCurrent: true }, { isCurrent: false });

  const rate = await GoldRate.create({
    rate24k,
    rate22k,
    rate18k,
    silverRate,
    date: date || new Date(),
    isCurrent: true,
  });

  const updatedProductsCount = await recalculateRateLinkedProducts(rate);

  res.status(201).json({ success: true, rate, updatedProductsCount });
});

// @desc    Edit an existing rate entry (e.g. fix a typo). If it's the
//          current rate, rate-linked product prices are recalculated too.
// @route   PUT /api/gold-rates/:id
// @access  Private/Admin
const updateGoldRate = asyncHandler(async (req, res) => {
  const rate = await GoldRate.findById(req.params.id);
  if (!rate) {
    res.status(404);
    throw new Error('Rate entry not found');
  }
  Object.assign(rate, req.body);
  await rate.save();

  let updatedProductsCount = 0;
  if (rate.isCurrent) {
    updatedProductsCount = await recalculateRateLinkedProducts(rate);
  }

  res.status(200).json({ success: true, rate, updatedProductsCount });
});

module.exports = { getGoldRates, createGoldRate, updateGoldRate };
