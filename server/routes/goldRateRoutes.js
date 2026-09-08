const express = require('express');
const { getGoldRates, createGoldRate, updateGoldRate } = require('../controllers/goldRateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getGoldRates);
router.post('/', protect, authorize('ADMIN'), createGoldRate);
router.put('/:id', protect, authorize('ADMIN'), updateGoldRate);

module.exports = router;
