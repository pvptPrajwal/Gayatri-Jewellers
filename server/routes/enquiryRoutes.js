const express = require('express');
const { createEnquiry, getEnquiries, updateEnquiry } = require('../controllers/enquiryController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', publicFormLimiter, optionalAuth, createEnquiry);
router.get('/', protect, authorize('ADMIN'), getEnquiries);
router.put('/:id', protect, authorize('ADMIN'), updateEnquiry);

module.exports = router;
