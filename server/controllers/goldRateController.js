const asyncHandler = require('express-async-handler');
const GoldRate = require('../models/GoldRate');

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

// @desc    Add a new gold rate entry — becomes the current rate
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

  res.status(201).json({ success: true, rate });
});

// @desc    Edit an existing rate entry (e.g. fix a typo)
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
  res.status(200).json({ success: true, rate });
});

module.exports = { getGoldRates, createGoldRate, updateGoldRate };
