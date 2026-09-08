const mongoose = require('mongoose');
const slugify = require('slugify');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, required: [true, 'SKU is required'], unique: true, trim: true, uppercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, default: '' },
    tags: [{ type: String, trim: true }],

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },

    mainImage: imageSchema,
    images: [imageSchema],

    metal: {
      type: String,
      enum: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Rose Gold', 'White Gold'],
      required: true,
    },
    purity: { type: String, required: true }, // e.g. "22K", "18K", "925 Silver"
    grossWeight: { type: Number, required: true, min: 0 }, // grams
    netWeight: { type: Number, required: true, min: 0 }, // grams
    diamondWeight: { type: Number, default: 0 }, // carats
    stoneType: { type: String, default: '' },
    size: { type: String, default: '' },

    basePrice: { type: Number, required: true, min: 0 },
    makingCharges: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    finalPrice: { type: Number, min: 0 },

    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    stockStatus: {
      type: String,
      enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
      default: 'IN_STOCK',
    },

    gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'], default: 'Women' },
    occasion: [{ type: String, trim: true }],

    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ finalPrice: 1 });

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;
  }
  next();
});

productSchema.pre('save', function computeDerivedFields(next) {
  const subtotal = (this.basePrice || 0) + (this.makingCharges || 0);
  const discountAmount = subtotal * ((this.discount || 0) / 100);
  this.finalPrice = Math.round((subtotal - discountAmount) * 100) / 100;

  if (this.stockQuantity <= 0) {
    this.stockStatus = 'OUT_OF_STOCK';
  } else if (this.stockQuantity <= 3) {
    this.stockStatus = 'LOW_STOCK';
  } else {
    this.stockStatus = 'IN_STOCK';
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
