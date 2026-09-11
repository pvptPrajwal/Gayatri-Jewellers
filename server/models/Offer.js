const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FLAT', 'MAKING_CHARGE_OFF'],
      default: 'PERCENTAGE',
    },
    discountValue: { type: Number, required: true, min: 0 },
    code: { type: String, trim: true, uppercase: true },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    validFrom: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
    termsAndConditions: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

offerSchema.index({ isActive: 1, validTill: 1 });

// Virtual: true once validTill has passed, regardless of isActive flag
offerSchema.virtual('isExpired').get(function isExpired() {
  return this.validTill < new Date();
});
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Offer', offerSchema);
