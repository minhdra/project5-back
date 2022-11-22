const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    supplier_name: {
      type: String,
      required: true,
      max: 255,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    description: {
      type: String,
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

module.exports = mongoose.model('suppliers', supplierSchema);
