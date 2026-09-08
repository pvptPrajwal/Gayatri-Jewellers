const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateAndFormat = async (cart) => {
  await cart.populate('items.product', 'name slug mainImage finalPrice stockQuantity stockStatus metal purity');
  const items = cart.items
    .filter((i) => i.product) // drop items whose product was deleted
    .map((i) => ({
      productId: i.product._id,
      name: i.product.name,
      slug: i.product.slug,
      image: i.product.mainImage?.url,
      finalPrice: i.product.finalPrice,
      metal: i.product.metal,
      purity: i.product.purity,
      stockQuantity: i.product.stockQuantity,
      stockStatus: i.product.stockStatus,
      quantity: i.quantity,
    }));
  return items;
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const items = await populateAndFormat(cart);
  res.status(200).json({ success: true, items });
});

// @desc    Add an item to cart, or bump quantity if it already exists.
//          Also accepts a `merge` array to merge a guest's local cart on login.
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, merge } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const upsert = async (pid, qty) => {
    const product = await Product.findById(pid);
    if (!product || !product.isActive) return;
    const existing = cart.items.find((i) => i.product.toString() === pid);
    const cap = product.stockQuantity || 99;
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, cap);
    } else {
      cart.items.push({ product: pid, quantity: Math.min(qty, cap) });
    }
  };

  if (Array.isArray(merge)) {
    for (const item of merge) {
      // eslint-disable-next-line no-await-in-loop
      await upsert(item.productId, item.quantity || 1);
    }
  } else if (productId) {
    await upsert(productId, quantity);
  } else {
    res.status(400);
    throw new Error('productId is required');
  }

  await cart.save();
  const items = await populateAndFormat(cart);
  res.status(200).json({ success: true, items });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const item = cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }
  item.quantity = Math.max(1, Number(quantity) || 1);
  await cart.save();
  const items = await populateAndFormat(cart);
  res.status(200).json({ success: true, items });
});

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  const items = await populateAndFormat(cart);
  res.status(200).json({ success: true, items });
});

// @desc    Clear the cart (used after placing an order)
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { upsert: true });
  res.status(200).json({ success: true, items: [] });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
