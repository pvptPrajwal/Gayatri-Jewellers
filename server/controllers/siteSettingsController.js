const asyncHandler = require('express-async-handler');
const SiteSettings = require('../models/SiteSettings');

// @desc    Get site-wide editable images (hero banner, footer logo)
// @route   GET /api/site-settings
// @access  Public
const getSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    // First-ever request — create the singleton doc with empty images so
    // the frontend can fall back to its bundled defaults.
    settings = await SiteSettings.create({ key: 'main' });
  }
  res.status(200).json({ success: true, settings });
});

// Every editable image slot lives here — add a new Home/About image by
// adding its field name to this list and to the SiteSettings schema.
const EDITABLE_IMAGE_FIELDS = [
  'heroImage',
  'storeImage',
  'aboutHeroImage',
  'aboutWorkshopImage',
];

// @desc    Update site-wide editable images (Home page, About page, footer)
// @route   PUT /api/site-settings
// @access  Private/Admin
const updateSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = new SiteSettings({ key: 'main' });
  }

  EDITABLE_IMAGE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) settings[field] = req.body[field];
  });

  await settings.save();
  res.status(200).json({ success: true, settings });
});

module.exports = { getSiteSettings, updateSiteSettings };
