const express = require('express');
const { getUsers, updateUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('ADMIN'), getUsers);
router.put('/:id/status', protect, authorize('ADMIN'), updateUserStatus);

module.exports = router;
