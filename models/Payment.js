const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer: {
      type: Number,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    account_no: {
      type: Number,
    },
    expiry: {
      type: Date,
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

module.exports = mongoose.model('payments', paymentSchema);
