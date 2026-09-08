const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Place an order from the current cart (or explicit items)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD' } = req.body;

  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) continue; // eslint-disable-line no-continue
    if (product.stockQuantity < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} only has ${product.stockQuantity} in stock`);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.mainImage?.url,
      sku: product.sku,
      price: product.finalPrice,
      quantity: item.quantity,
    });
  }

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error('No valid items to order');
  }

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCharges = 0; // complimentary shipping per store policy
  const totalPrice = itemsPrice + shippingCharges;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingCharges,
    totalPrice,
  });

  // Decrement stock for each ordered product
  await Promise.all(
    orderItems.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } }))
  );
  // Re-run stock status recalculation on each affected product
  await Promise.all(
    orderItems.map(async (item) => {
      const p = await Product.findById(item.product);
      if (p) await p.save(); // triggers pre-save stockStatus hook
    })
  );

  // Clear the cart after a successful order
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

// @desc    Get orders — the logged-in user's own orders, or ALL orders if admin
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = req.user.role === 'ADMIN' ? {} : { user: req.user._id };
  if (status) query.status = status;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 50);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    orders,
  });
});

// @desc    Get a single order (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (req.user.role !== 'ADMIN' && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.status(200).json({ success: true, order });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Order.STATUS_FLOW.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${Order.STATUS_FLOW.join(', ')}`);
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  order.statusHistory.push({ status, changedAt: new Date() });
  if (status === 'DELIVERED') order.paymentStatus = 'PAID';
  await order.save();

  res.status(200).json({ success: true, order });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
