const mongoose = require('mongoose');

// A single-document collection: site-wide editable images (home hero banner,
// footer logo). We always read/write the one document with a fixed key so
// the admin panel doesn't need to know a Mongo _id.
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
    heroImage: { type: imageSubSchema, default: () => ({}) },
    footerLogo: { type: imageSubSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
