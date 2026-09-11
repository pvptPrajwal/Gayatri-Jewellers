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

// @desc    Update site-wide editable images (hero banner and/or footer logo)
// @route   PUT /api/site-settings
// @access  Private/Admin
const updateSiteSettings = asyncHandler(async (req, res) => {
  const { heroImage, footerLogo } = req.body;

  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) {
    settings = new SiteSettings({ key: 'main' });
  }

  if (heroImage !== undefined) settings.heroImage = heroImage;
  if (footerLogo !== undefined) settings.footerLogo = footerLogo;

  await settings.save();
  res.status(200).json({ success: true, settings });
});

module.exports = { getSiteSettings, updateSiteSettings };
