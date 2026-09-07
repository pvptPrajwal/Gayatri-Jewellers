const express = require('express');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCollections);
router.get('/:id', getCollectionById);
router.post('/', protect, authorize('ADMIN'), createCollection);
router.put('/:id', protect, authorize('ADMIN'), updateCollection);
router.delete('/:id', protect, authorize('ADMIN'), deleteCollection);

module.exports = router;
