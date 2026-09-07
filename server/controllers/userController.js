const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    List customers (with basic search + pagination)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    users: users.map((u) => u.toSafeObject()),
  });
});

// @desc    Activate/deactivate a customer account
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'ADMIN') {
    res.status(400);
    throw new Error('Admin accounts cannot be deactivated from this endpoint');
  }
  user.isActive = req.body.isActive;
  await user.save();
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

module.exports = { getUsers, updateUserStatus };
