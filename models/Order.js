const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    payment_type: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    delivery_address: {
      type: Object,
      required: true,
    },
    note: {
      type: String,
    },
    total: {
      type: Number,
      default: 0,
    },
    details: {
      type: Array,
      default: [],
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('orders', orderSchema);
