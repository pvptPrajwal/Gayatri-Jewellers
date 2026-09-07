const asyncHandler = require('express-async-handler');
const Collection = require('../models/Collection');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const collections = await Collection.find(filter).sort({ displayOrder: 1, name: 1 });
  res.status(200).json({ success: true, count: collections.length, collections });
});

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Public
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }
  res.status(200).json({ success: true, collection });
});

// @desc    Create collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create(req.body);
  res.status(201).json({ success: true, collection });
});

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }
  Object.assign(collection, req.body);
  await collection.save();
  res.status(200).json({ success: true, collection });
});

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }
  await collection.deleteOne();
  res.status(200).json({ success: true, message: 'Collection deleted successfully' });
});

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
