const mongoose = require('mongoose');

const goldRateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    rate24k: { type: Number, required: true }, // per gram, INR
    rate22k: { type: Number, required: true },
    rate18k: { type: Number, required: true },
    silverRate: { type: Number, required: true }, // per gram, INR
    isCurrent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

goldRateSchema.index({ date: -1 });

module.exports = mongoose.model('GoldRate', goldRateSchema);
