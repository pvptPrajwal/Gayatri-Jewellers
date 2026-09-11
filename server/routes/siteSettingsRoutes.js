const express = require('express');
const { getSiteSettings, updateSiteSettings } = require('../controllers/siteSettingsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSiteSettings);
router.put('/', protect, authorize('ADMIN'), updateSiteSettings);

module.exports = router;
