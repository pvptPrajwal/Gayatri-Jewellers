const asyncHandler = require('express-async-handler');
const Offer = require('../models/Offer');

// @desc    Get offers — active & unexpired by default, or everything for admin
// @route   GET /api/offers
// @access  Public
const getOffers = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.all !== 'true') {
    query.isActive = true;
    query.validTill = { $gte: new Date() };
  }

  const offers = await Offer.find(query)
    .populate('category', 'name slug')
    .populate('collection', 'name slug')
    .sort({ displayOrder: 1, validTill: 1 });

  res.status(200).json({ success: true, count: offers.length, offers });
});

// @desc    Get a single offer
// @route   GET /api/offers/:id
// @access  Public
const getOfferById = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }
  res.status(200).json({ success: true, offer });
});

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(req.body);
  res.status(201).json({ success: true, offer });
});

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }
  Object.assign(offer, req.body);
  await offer.save();
  res.status(200).json({ success: true, offer });
});

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }
  await offer.deleteOne();
  res.status(200).json({ success: true, message: 'Offer deleted' });
});

module.exports = { getOffers, getOfferById, createOffer, updateOffer, deleteOffer };
