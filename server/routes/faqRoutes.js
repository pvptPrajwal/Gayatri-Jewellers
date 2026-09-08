const express = require('express');
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getFAQs);
router.post('/', protect, authorize('ADMIN'), createFAQ);
router.put('/:id', protect, authorize('ADMIN'), updateFAQ);
router.delete('/:id', protect, authorize('ADMIN'), deleteFAQ);

module.exports = router;
