const express = require('express');
const { getOffers, getOfferById, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getOffers);
router.get('/:id', getOfferById);
router.post('/', protect, authorize('ADMIN'), createOffer);
router.put('/:id', protect, authorize('ADMIN'), updateOffer);
router.delete('/:id', protect, authorize('ADMIN'), deleteOffer);

module.exports = router;
