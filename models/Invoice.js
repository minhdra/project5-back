const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    staff: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    product: {
      type: Number,
      required: true,
    },
    supplier: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    total: {
      type: String,
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

module.exports = mongoose.model('invoices', invoiceSchema);
