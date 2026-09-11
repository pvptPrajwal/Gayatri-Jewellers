const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
    link: { type: String, default: '' }, // internal path (e.g. /shop?category=..) or external URL
    buttonText: { type: String, default: 'Shop Now' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bannerSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
