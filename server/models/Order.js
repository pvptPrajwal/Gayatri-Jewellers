const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    sku: { type: String },
    price: { type: Number, required: true }, // finalPrice at time of order
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    shippingAddress: { type: addressSnapshotSchema, required: true },
    paymentMethod: { type: String, enum: ['COD', 'ONLINE'], default: 'COD' },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    itemsPrice: { type: Number, required: true },
    shippingCharges: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: STATUS_FLOW, default: 'PENDING' },
    statusHistory: {
      type: [
        {
          status: { type: String, enum: STATUS_FLOW },
          changedAt: { type: Date, default: Date.now },
        },
      ],
      default: () => [{ status: 'PENDING', changedAt: new Date() }],
    },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function generateOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `RJ${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
  }
  next();
});

orderSchema.statics.STATUS_FLOW = STATUS_FLOW;

module.exports = mongoose.model('Order', orderSchema);
