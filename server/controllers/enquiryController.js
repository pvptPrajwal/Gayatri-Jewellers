const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/Enquiry');

// @desc    Submit an enquiry (contact form or product enquiry) — works for guests and logged-in users
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = asyncHandler(async (req, res) => {
  const { name, phone, email, subject, message, product } = req.body;

  if (!name || !phone || !subject || !message) {
    res.status(400);
    throw new Error('Name, phone, subject and message are required');
  }

  const enquiry = await Enquiry.create({
    name,
    phone,
    email,
    subject,
    message,
    product: product || undefined,
    user: req.user?._id, // set only if request came through an authenticated session
  });

  res.status(201).json({ success: true, enquiry });
});

// @desc    List enquiries (admin)
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [enquiries, total] = await Promise.all([
    Enquiry.find(query)
      .populate('product', 'name slug')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Enquiry.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: enquiries.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    enquiries,
  });
});

// @desc    Update an enquiry's status / admin notes
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  if (req.body.status) enquiry.status = req.body.status;
  if (req.body.adminNotes !== undefined) enquiry.adminNotes = req.body.adminNotes;
  await enquiry.save();
  res.status(200).json({ success: true, enquiry });
});

module.exports = { createEnquiry, getEnquiries, updateEnquiry };
