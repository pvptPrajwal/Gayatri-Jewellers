const asyncHandler = require('express-async-handler');
const FAQ = require('../models/FAQ');

// @desc    Get all FAQs (grouped by category on the frontend)
// @route   GET /api/faqs
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const faqs = await FAQ.find(filter).sort({ category: 1, displayOrder: 1 });
  res.status(200).json({ success: true, count: faqs.length, faqs });
});

// @desc    Create an FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, faq });
});

// @desc    Update an FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  Object.assign(faq, req.body);
  await faq.save();
  res.status(200).json({ success: true, faq });
});

// @desc    Delete an FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }
  await faq.deleteOne();
  res.status(200).json({ success: true, message: 'FAQ deleted' });
});

module.exports = { getFAQs, createFAQ, updateFAQ, deleteFAQ };
