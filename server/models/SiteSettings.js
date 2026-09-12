const mongoose = require('mongoose');

// A single-document collection: site-wide editable images (Home page and
// About Us page). We always read/write the one document with a fixed key
// so the admin panel doesn't need to know a Mongo _id.
const imageSubSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },

    // Home page
    heroImage: { type: imageSubSchema, default: () => ({}) },
    storeImage: { type: imageSubSchema, default: () => ({}) },

    // About Us page
    aboutHeroImage: { type: imageSubSchema, default: () => ({}) },
    aboutWorkshopImage: { type: imageSubSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
